import Appointment from '../models/appointmentModel.js';
import User from '../models/userModel.js';
import Settings from '../models/settingsModel.js';

// @desc    Get all available appointment slots
// @route   GET /api/appointments/slots
// @access  Public
export const getAvailableSlots = async (req, res) => {
    try {
        const settings = await Settings.getSingleton();
        const {
            openingTime,
            closingTime,
            slotDurationMinutes,
            timeGapMinutes,
            totalBeds,
            bufferBeds,
        } = settings;

        const bookableBeds = totalBeds - bufferBeds;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureBookings = await Appointment.find({
            slotDate: { $gte: today },
            status: 'booked',
        }).select('slotDate slotTime');

        const slots = [];
        const daysToGenerate = 7; // Generate slots for the next 7 days

        for (let i = 0; i < daysToGenerate; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const daySlots = {
                date: date.toISOString().split('T')[0],
                times: [],
            };

            const [openHour, openMinute] = openingTime.split(':').map(Number);
            const [closeHour, closeMinute] = closingTime.split(':').map(Number);

            let currentTime = new Date(date);
            currentTime.setHours(openHour, openMinute, 0, 0);

            const closingDateTime = new Date(date);
            closingDateTime.setHours(closeHour, closeMinute, 0, 0);

            while (currentTime < closingDateTime) {
                const slotTime = currentTime.toTimeString().substring(0, 5);
                
                const bookingCount = futureBookings.filter(b => 
                    new Date(b.slotDate).toDateString() === date.toDateString() && 
                    b.slotTime === slotTime
                ).length;

                if (bookingCount < bookableBeds) {
                    daySlots.times.push(slotTime);
                }

                currentTime.setMinutes(currentTime.getMinutes() + slotDurationMinutes + timeGapMinutes);
            }
            
            if (daySlots.times.length > 0) {
                slots.push(daySlots);
            }
        }

        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching slots' });
    }
};

// @desc    Book an appointment
// @route   POST /api/appointments/book
// @access  Private
export const bookAppointment = async (req, res) => {
    const { slotDate, slotTime } = req.body;
    const donorId = req.user.id;

    if (!slotDate || !slotTime) {
        return res.status(400).json({ message: 'Please provide a date and time' });
    }

    try {
        const donor = await User.findById(donorId);

        // 1. Check donor eligibility
        if (donor.eligibilityStatus !== 'eligible') {
            return res.status(400).json({
                message: `You are not eligible to donate. Please complete the screening form or wait until your deferral period is over.`,
            });
        }
        if (donor.nextEligibleDate && new Date() < new Date(donor.nextEligibleDate)) {
            return res.status(400).json({
                message: `You are not eligible to donate until ${new Date(
                    donor.nextEligibleDate
                ).toLocaleDateString()}`,
            });
        }

        // 2. Check if donor has another active booking
        const existingAppointment = await Appointment.findOne({
            donorId,
            status: { $in: ['booked', 'checked-in', 'donating'] },
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'You already have an active appointment' });
        }

        // 3. Check slot availability
        const settings = await Settings.getSingleton();
        const bookableBeds = settings.totalBeds - settings.bufferBeds;
        const appointmentsInSlot = await Appointment.countDocuments({
            slotDate,
            slotTime,
            status: 'booked',
        });

        if (appointmentsInSlot >= bookableBeds) {
            return res.status(400).json({ message: 'This slot is fully booked' });
        }

        // 4. Create the appointment
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

// @desc    Get appointments for the logged-in user
// @route   GET /api/appointments/my
// @access  Private
export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ donorId: req.user.id }).sort({ slotDate: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all appointments for a given day (Admin)
// @route   GET /api/appointments/all
// @access  Private/Admin
export const getAllAppointments = async (req, res) => {
    // Defaults to today if no date is provided in query
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();
    queryDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(queryDate);
    nextDay.setDate(queryDate.getDate() + 1);

    try {
        const appointments = await Appointment.find({
            slotDate: {
                $gte: queryDate,
                $lt: nextDay,
            },
        }).populate('donorId', 'name bloodGroup').sort({ slotTime: 1 }); // Populate with donor info

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update appointment status (Admin)
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
export const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;
    const appointmentId = req.params.id;

    try {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = status;

        // If donation is completed, update donor's eligibility and history
        if (status === 'completed') {
            const threeMonthsFromNow = new Date();
            threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
            
            const donor = await User.findById(appointment.donorId);
            donor.lastDonationDate = new Date();
            donor.nextEligibleDate = threeMonthsFromNow;
            donor.eligibilityStatus = 'deferred';
            donor.donationHistory.push({
                donationDate: new Date(),
                appointmentId: appointment._id,
            });
            await donor.save();
        }
        
        await appointment.save();
        res.json(appointment);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Check-in a donor for their appointment (Admin)
// @route   POST /api/appointments/:id/checkin
// @access  Private/Admin
export const checkIn = async (req, res) => {
    const appointmentId = req.params.id;

    try {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // For now, a simple check-in. The complex logic will be added next.
        appointment.status = 'checked-in';
        appointment.checkInTime = new Date();
        
        await appointment.save();
        res.json(appointment);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
