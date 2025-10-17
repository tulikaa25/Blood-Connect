import Appointment from '../models/appointmentModel.js';
import User from '../models/userModel.js';
import Settings from '../models/settingsModel.js';

// @desc    Get available slots for next 7 days
// @route   GET /api/appointments/slots
// @access  Public (User) / Private (Admin)
export const getSlots = async (req, res) => {
    try {
        const userRole = req.user?.role || 'user'; // default to 'user' if not logged in
        if (userRole !== 'admin' && req.user) {
    const user = await User.findById(req.user.id);
    if (!user || user.eligibilityStatus !== 'eligible') {
        return res.status(400).json({
            message: 'Complete screening form and be eligible to book slots.'
        });
    }
}

        const settings = await Settings.getSingleton();
        const { openingTime, closingTime, slotDurationMinutes, totalBeds } = settings;

        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get all booked appointments starting today
        const futureBookings = await Appointment.find({
            slotDate: { $gte: today },
            status: 'booked',
        }).select('slotDate slotTime');

        const slots = [];
        const daysToGenerate = 7;

        for (let i = 0; i < daysToGenerate; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const daySlots = {
                date: date.toISOString().split('T')[0],
                slots: [],
            };

            const [openHour, openMinute] = openingTime.split(':').map(Number);
            const [closeHour, closeMinute] = closingTime.split(':').map(Number);

            let currentTime = new Date(date);
            currentTime.setHours(openHour, openMinute, 0, 0);

            const closingTimeObj = new Date(date);
            closingTimeObj.setHours(closeHour, closeMinute, 0, 0);

            // Start from next available time if today
            if (i === 0 && now > currentTime) {
                currentTime = new Date(now);
                // Round up to next slot based on slotDurationMinutes
                const minutes = currentTime.getMinutes();
                const remainder = minutes % slotDurationMinutes;
                if (remainder > 0) currentTime.setMinutes(minutes + (slotDurationMinutes - remainder));
            }

            while (currentTime < closingTimeObj) {
                const slotTime = currentTime.toTimeString().substring(0, 5);

                const bookedCount = futureBookings.filter(
                    b =>
                        new Date(b.slotDate).toDateString() === date.toDateString() &&
                        b.slotTime === slotTime
                ).length;

                const availableBeds = totalBeds - bookedCount;

                const slotInfo = { time: slotTime, availableBeds };
                if (userRole === 'admin') slotInfo.totalBeds = totalBeds;

                daySlots.slots.push(slotInfo);
                currentTime.setMinutes(currentTime.getMinutes() + slotDurationMinutes);
            }

            if (daySlots.slots.length > 0) slots.push(daySlots);
        }

        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching slots' });
    }
};

export const bookAppointment = async (req, res) => {
    const { slotDate, slotTime } = req.body;
    const donorId = req.user.id;

    if (!slotDate || !slotTime) {
        return res.status(400).json({ message: 'Please provide slotDate and slotTime' });
    }

    try {
        const donor = await User.findById(donorId);

        // 1️⃣ Check donor eligibility
        if (donor.eligibilityStatus !== 'eligible') {
            return res.status(400).json({ message: 'You are not eligible to donate.' });
        }

        if (donor.nextEligibleDate && new Date() < new Date(donor.nextEligibleDate)) {
            return res.status(400).json({ 
                message: `You can donate again on ${new Date(donor.nextEligibleDate).toLocaleDateString()}` 
            });
        }

        // 2️⃣ Check if donor already has a booked/active appointment
        const existingAppointment = await Appointment.findOne({
            donorId,
            status: { $in: ['booked', 'checked-in', 'donating'] },
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'You already have an active appointment.' });
        }

        // 3️⃣ Check slot availability
        const settings = await Settings.getSingleton();
        const { totalBeds } = settings;

        const bookedCount = await Appointment.countDocuments({
            slotDate: new Date(slotDate),
            slotTime,
            status: 'booked',
        });

        if (bookedCount >= totalBeds) {
            return res.status(400).json({ message: 'Selected slot is full. Please choose another slot.' });
        }

        // 4️⃣ Create appointment
        const appointment = await Appointment.create({
            donorId,
            slotDate,
            slotTime,
        });

        res.status(201).json(appointment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while booking appointment' });
    }
};