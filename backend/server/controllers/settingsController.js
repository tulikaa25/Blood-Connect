import Settings from '../models/settingsModel.js';

// @desc    Get settings
// @route   GET /api/settings
// @access  Private/Admin
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSingleton();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
    try {
        const settings = await Settings.getSingleton();
        
        // Update all fields from the request body
        Object.assign(settings, req.body);

        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
