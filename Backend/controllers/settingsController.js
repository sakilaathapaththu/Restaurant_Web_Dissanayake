const Settings = require("../models/Settings");

// Get all settings
exports.getSettings = async (req, res, next) => {
    try {
        const settings = await Settings.find();
        const settingsObj = {};
        settings.forEach(setting => {
            settingsObj[setting.key] = setting.value;
        });
        res.json({ success: true, data: settingsObj });
    } catch (err) {
        next(err);
    }
};

// Get specific setting
exports.getSetting = async (req, res, next) => {
    try {
        const { key } = req.params;
        const setting = await Settings.findOne({ key });
        if (!setting) {
            return res.status(404).json({ error: "Setting not found" });
        }
        res.json({ success: true, data: { key: setting.key, value: setting.value } });
    } catch (err) {
        next(err);
    }
};

// Update setting
exports.updateSetting = async (req, res, next) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        const updatedBy = req.user.sub;

        if (value === undefined) {
            return res.status(400).json({ error: "Value is required" });
        }

        const setting = await Settings.findOneAndUpdate(
            { key },
            { value, updatedBy },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            data: { key: setting.key, value: setting.value },
            message: "Setting updated successfully"
        });
    } catch (err) {
        next(err);
    }
};

// Initialize default settings
exports.initializeSettings = async (req, res, next) => {
    try {
        const defaultSettings = [
            { key: "deliveryEnabled", value: true, description: "Enable/disable delivery option for customers" },
            { key: "deliveryFee", value: 0, description: "Default delivery fee" },
            { key: "minOrderAmount", value: 0, description: "Minimum order amount for delivery" }
        ];

        for (const setting of defaultSettings) {
            await Settings.findOneAndUpdate(
                { key: setting.key },
                setting,
                { upsert: true }
            );
        }

        res.json({ success: true, message: "Default settings initialized" });
    } catch (err) {
        next(err);
    }
};
