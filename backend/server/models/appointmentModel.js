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
        enum: ['N/A','booked','completed','cancelled'],
        default: 'N/A',
    },
    checkInTime: {
        type: Date,
    },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
