import Appointment from '../models/appointmentModel.js';
import User from '../models/userModel.js';
import Settings from '../models/settingsModel.js';


// @route   GET /api/appointments/slots
// @access  Public (User) / Private (Admin)
//GETTING SLOTS
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





//BOOKING SLOT
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


//VERIFY APPT using Appt id 
export const verifyQrAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ message: "Appointment ID is required" });
        }

        // 🔍 Find appointment and populate donor details
        const appointment = await Appointment.findById(appointmentId).populate("donorId", "name phone bloodGroup");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // ⚠️ Check appointment is still valid (must be 'booked')
        if (appointment.status !== "booked") {
            return res.status(400).json({
                message: `Cannot verify QR. Appointment is already '${appointment.status}'.`
            });
        }

        // ✅ Mark as checked-in
        appointment.status = "checked-in";
        await appointment.save();

        // 🧾 Get donor details
        const donor = appointment.donorId;

        res.status(200).json({
            message: "QR verified successfully. Donor checked-in ✅",
            appointment,
            donorDetails: {
                name: donor.name,
                phone: donor.phone,
                bloodGroup: donor.bloodGroup
            }
        });

    } catch (error) {
        console.error("QR verification failed:", error);
        res.status(500).json({ message: "Server error verifying QR" });
    }
};



//CANCELLING APPT
export const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const userId = req.user.id;      // From auth middleware
        const userRole = req.user.role;  // 'donor' or 'admin'

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        //  Donor cancel rules
        if (userRole === "donor") {
            // Can only cancel their own appointment
            if (appointment.donorId.toString() !== userId) {
                return res.status(403).json({ message: "" });
            }

            // Cannot cancel after check-in
            if (["checked-in", "donating", "completed"].includes(appointment.status)) {
                return res.status(400).json({
                    message: `You cannot cancel after check-in. Current status: ${appointment.status}`
                });
            }
        }

        //  Admin cancel rules (allowed anytime up to donation)
        if (userRole === "admin") {
            if (appointment.status === "completed") {
                return res.status(400).json({ message: "Cannot cancel a completed appointment" });
            }
        }

        //  Only booked or checked-in can be cancelled
        if (!["booked", "checked-in"].includes(appointment.status)) {
            return res.status(400).json({
                message: `Only booked or checked-in appointments can be cancelled. Current status: ${appointment.status}`
            });
        }

        //  Set cancel status
        appointment.status = "cancelled";

        await appointment.save();

        return res.status(200).json({
            message: userRole === "admin"
                ? "Appointment cancelled by admin"
                : "Your appointment has been cancelled"
        });

    } catch (error) {
        console.error("Cancel appointment error:", error);
        res.status(500).json({ message: "Error cancelling appointment" });
    }
};



//MARK APPT COMPLETE 
export const completeAppointment = async (req, res) => {
    try {
        const { appointmentId, passedMedicalCheck } = req.body;
        const adminId = req.user.id;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can complete appointments" });
        }

        if (!appointmentId || passedMedicalCheck === undefined) {
            return res.status(400).json({ message: "appointmentId and passedMedicalCheck are required" });
        }

        const appointment = await Appointment.findById(appointmentId).populate("donorId");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.status !== "checked-in") {
            return res.status(400).json({
                message: `Only checked-in appointments can be completed. Current status: ${appointment.status}`
            });
        }

        // If medical test failed → cancel appointment
        if (!passedMedicalCheck) {
            appointment.cancelReason = "Failed medical screening";
            req.body.cancelReason = "Failed medical screening";
            return cancelAppointment(req, res);  // reuse cancel logic
        }

        // If passed medical → complete donation
        appointment.status = "completed";
        appointment.completedAt = new Date();
        await appointment.save();

        // Update donor history
        const donor = appointment.donorId;
        donor.lastDonationDate = new Date();

        // Next eligible date = 56 days later
        const nextEligibleDate = new Date();
        nextEligibleDate.setDate(nextEligibleDate.getDate() + 56);
        donor.nextEligibleDate = nextEligibleDate;

        donor.donationHistory.push({
            appointmentId: appointment._id,
            donationDate: new Date(),
        });

        await donor.save();

        return res.status(200).json({ message: "Appointment marked as completed successfully" });

    } catch (error) {
        console.error("Complete appointment error:", error);
        res.status(500).json({ message: "Error completing appointment" });
    }
};