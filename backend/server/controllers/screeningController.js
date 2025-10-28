import User from '../models/userModel.js';

// @desc    Submit screening form for a donor
// @route   POST /api/screening/submit
// @access  Private
export const submitScreeningForm = async (req, res) => {
    const donorId = req.user.id;
    const {
        age,
        weight,
        medicalConditions,
        longTermMedications,
        medicationDetails,
        tattooOrPiercing,
        vaccination,
        isPregnantOrBreastfeeding
    } = req.body;

    try {
        const user = await User.findById(donorId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate age and weight
        if (!age || age < 18 || age > 65) {
            return res.status(400).json({ message: 'Age must be between 18 and 65' });
        }
        if (!weight || weight < 45) {
            return res.status(400).json({ message: 'Weight must be at least 45 kg' });
        }

        // Set hasDonatedBefore from donationHistory
        const hasDonatedBefore = user.donationHistory?.length > 0;
        const lastDonationDate = hasDonatedBefore
            ? user.donationHistory[user.donationHistory.length - 1].donationDate
            : null;

        // For females, allow breastfeeding/pregnant question, else force false
        const gender = user.gender?.toLowerCase();
        const breastfeedingOrPregnant =
            gender === 'female' ? Boolean(isPregnantOrBreastfeeding) : false;

        // Store screening data
        user.screeningData = {
            age,
            weight,
            medicalConditions,
            longTermMedications: Boolean(longTermMedications),
            medicationDetails: longTermMedications ? medicationDetails : null,
            hasDonatedBefore,
            lastDonationDate,
            tattooOrPiercing: Boolean(tattooOrPiercing),
            vaccination: Boolean(vaccination),
            isPregnantOrBreastfeeding: breastfeedingOrPregnant,
        };

        // Determine eligibility
        let isEligible = true;

        // Check serious medical conditions
        if (Object.values(medicalConditions).some(cond => cond === true)) {
            isEligible = false;
        }

        // Check age and weight eligibility
        if (age < 18 || age > 65 || weight < 45) {
            isEligible = false;
        }

        user.eligibilityStatus = isEligible ? 'eligible' : 'deferred';

        await user.save();

        res.json({
            message: 'Screening form submitted successfully.',
            eligibilityStatus: user.eligibilityStatus,
           
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while submitting screening form' });
    }
};
