import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    slotDate: {
        type: Date,
        required: true,
    },
    slotTime: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['booked', 'checked-in', 'donating', 'completed', 'cancelled', 'no-show', 'waiting_in_queue'],
        default: 'booked',
    },
    checkInTime: {
        type: Date,
    },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
