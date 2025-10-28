export const updateEligibilityIfNeeded = async (user) => {
  try {
    // Only check for deferred users
    if (
      user.eligibilityStatus === 'deferred' &&
      user.nextEligibleDate &&
      new Date() >= new Date(user.nextEligibleDate)
    ) {
      user.eligibilityStatus = 'pending-screening';
      user.screeningForm = null;
      user.nextEligibleDate = null;
      await user.save();
    }
  } catch (error) {
    console.error('Error updating eligibility:', error);
  }
};
