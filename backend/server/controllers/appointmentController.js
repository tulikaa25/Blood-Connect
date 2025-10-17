import Appointment from '../models/appointmentModel.js';
import Settings from '../models/settingsModel.js';

// @desc    Get available slots for next 7 days
// @route   GET /api/appointments/slots
// @access  Public (User) / Private (Admin)
export const getSlots = async (req, res) => {
    try {
        const userRole = req.user?.role || 'user'; // default to 'user' if not logged in

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
