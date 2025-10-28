// @desc    Get all donors with optional filters
export const getDonors = async (req, res) => {
  try {
    const { search, bloodGroup, status } = req.query;

    let query = { role: 'donor' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (status) query.eligibilityStatus = status;

    const donors = await User.find(query).select('-password'); // hide password
    res.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Error fetching donors' });
  }
};
