import User from '../models/userModel.js';

// @desc    Submit screening form for a donor
// @route   POST /api/screening/submit
// @access  Private
export const submitScreeningForm = async (req, res) => {
    const donorId = req.user.id;
    const screeningData = req.body;

    try {
        const user = await User.findById(donorId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Basic eligibility logic
        const { medicalConditions, permanentlyDeferred } = screeningData;
        let isEligible = true;

        // Check for any serious medical conditions
        if (Object.values(medicalConditions).some(condition => condition === true)) {
            isEligible = false;
        }

        if (permanentlyDeferred) {
            isEligible = false;
        }

        const newEligibilityStatus = isEligible ? 'eligible' : 'deferred';

        // Update user with screening data and new eligibility status
        user.screeningData = screeningData;
        user.eligibilityStatus = newEligibilityStatus;
        
        // If deferred, we might want to set a nextEligibleDate far in the future,
        // but for now, just setting the status is enough.

        await user.save();

        res.json({
            message: 'Screening form submitted successfully.',
            eligibilityStatus: newEligibilityStatus,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while submitting screening form' });
    }
};
