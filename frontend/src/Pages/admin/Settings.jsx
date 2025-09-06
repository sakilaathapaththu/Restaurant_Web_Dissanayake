import React, { useState, useEffect } from 'react';
import {
    Box, Card, CardContent, Typography, Switch, FormControlLabel,
    Button, Alert, CircularProgress, Divider, TextField, Snackbar
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import ResponsiveLayout from '../../Components/Dashboard/ResponsiveLayout';
import api from '../../Utils/api';

const Settings = () => {
    const [settings, setSettings] = useState({
        deliveryEnabled: true,
        deliveryFee: 0,
        minOrderAmount: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/settings');
            if (response.data.success) {
                setSettings({
                    deliveryEnabled: response.data.data.deliveryEnabled ?? true,
                    deliveryFee: response.data.data.deliveryFee ?? 0,
                    minOrderAmount: response.data.data.minOrderAmount ?? 0
                });
            }
        } catch (err) {
            setError('Failed to load settings');
            console.error('Error loading settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeliveryToggle = (event) => {
        setSettings(prev => ({
            ...prev,
            deliveryEnabled: event.target.checked
        }));
    };

    const handleInputChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveSettings = async () => {
        try {
            setSaving(true);
            setError('');

            // Update each setting individually
            await Promise.all([
                api.put(`/settings/deliveryEnabled`, { value: settings.deliveryEnabled }),
                api.put(`/settings/deliveryFee`, { value: parseFloat(settings.deliveryFee) || 0 }),
                api.put(`/settings/minOrderAmount`, { value: parseFloat(settings.minOrderAmount) || 0 })
            ]);

            setSuccess('Settings saved successfully!');
            setSnackbarOpen(true);
        } catch (err) {
            setError('Failed to save settings');
            console.error('Error saving settings:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        setSuccess('');
    };

    if (loading) {
        return (
            <ResponsiveLayout title="Settings">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </ResponsiveLayout>
        );
    }

    return (
        <ResponsiveLayout title="Settings">
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#3c1300' }}>
                Restaurant Settings
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Card sx={{ maxWidth: 800, mx: 'auto', boxShadow: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#2c1000' }}>
                        Delivery Settings
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.deliveryEnabled}
                                    onChange={handleDeliveryToggle}
                                    color="primary"
                                    size="large"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Enable Delivery Service
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Allow customers to choose delivery option during checkout
                                    </Typography>
                                </Box>
                            }
                            sx={{ alignItems: 'flex-start', mb: 2 }}
                        />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Delivery Configuration
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            <TextField
                                label="Delivery Fee (LKR)"
                                type="number"
                                value={settings.deliveryFee}
                                onChange={(e) => handleInputChange('deliveryFee', e.target.value)}
                                disabled={!settings.deliveryEnabled}
                                sx={{ minWidth: 200 }}
                                helperText="Additional charge for delivery orders"
                            />

                            <TextField
                                label="Minimum Order Amount (LKR)"
                                type="number"
                                value={settings.minOrderAmount}
                                onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                                disabled={!settings.deliveryEnabled}
                                sx={{ minWidth: 200 }}
                                helperText="Minimum order value for delivery"
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={loadSettings}
                            disabled={saving}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={saveSettings}
                            disabled={saving}
                            sx={{
                                backgroundColor: '#fda021',
                                '&:hover': {
                                    backgroundColor: '#e8d5c4',
                                    color: '#2c1000'
                                }
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </ResponsiveLayout>
    );
};

export default Settings;
