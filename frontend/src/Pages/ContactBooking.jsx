// src/Pages/ContactBooking.jsx
import * as React from "react";
import {
  Box, Card, CardContent, Grid, TextField, MenuItem, FormControlLabel, 
  Checkbox, Alert, Snackbar, Typography, Button, Container, Paper, Stack,
  Fade, Slide, IconButton, Divider
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { 
  Phone, Email, LocationOn, AccessTime, Restaurant, 
  CalendarToday, People, Message 
} from "@mui/icons-material";
import API from "../Utils/api";
import Footer from "../Components/Home/Footer";
import HomepageNavbar from "../Components/Navbar/Homepagenavbar";

// Form types
const TYPES = [
  { value: "question", label: "General Question" },
  { value: "reservation", label: "Book a Reservation" },
  { value: "event", label: "Book a Special Event" },
];

// Simple phone cleaner (Sri Lanka-friendly, keeps digits) - ensure string return
const normalizePhone = (v) => {
  if (v === null || v === undefined) return "";
  return String(v).replace(/\D/g, "");
};

export default function ContactBooking() {
  const [form, setForm] = React.useState({
    type: "question",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    occasion: "",
    budgetRange: "",
    message: "",
    agreeToPolicy: false,
  });

  const [loading, setLoading] = React.useState(false);
  const [ok, setOk] = React.useState("");
  const [err, setErr] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  // ✅ UPDATED: Enhanced useEffect with mobile zoom fix
  React.useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    setMounted(true);

    // Handle mobile zoom reset after input blur
    const handleBlur = () => {
      // Small delay to ensure the browser has time to process the blur
      setTimeout(() => {
        if (window.visualViewport) {
          // Force viewport reset if available
          window.scrollTo(0, window.pageYOffset);
        }
        // Alternative method for older browsers
        const metaViewport = document.querySelector('meta[name=viewport]');
        if (metaViewport) {
          const content = metaViewport.getAttribute('content');
          metaViewport.setAttribute('content', content);
        }
      }, 100);
    };

    // Add event listeners to all form inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', handleBlur);
    });

    // Cleanup
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);

  const isBooking = form.type !== "question";

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    
    // Ensure all values are strings (except checkbox)
    if (type === "checkbox") {
      processedValue = checked;
    } else if (name === "phone") {
      processedValue = normalizePhone(value);
    } else {
      // Ensure value is always a string
      processedValue = value === null || value === undefined ? "" : String(value);
    }
    
    setForm((f) => ({
      ...f,
      [name]: processedValue,
    }));
    setErr("");
  };

  const validate = () => {
    if (!form.type) return "Please select a request type.";
    if (!form.firstName || !form.firstName.trim()) return "First name is required.";
    if (!form.phone || form.phone.length < 9) return "Please enter a valid phone number.";
    if (!form.message || !form.message.trim()) return "Please write a short message.";
    if (isBooking) {
      if (!form.date) return "Please select a date.";
      if (!form.time) return "Please select a time.";
      const guestsNum = Number(form.guests || 0);
      if (!guestsNum || guestsNum < 1) return "Guests must be at least 1.";
    }
    if (!form.agreeToPolicy) return "Please agree to the privacy policy.";
    return "";
  };

  const resetAfterSuccess = () => {
    setForm((f) => ({
      ...f,
      date: "",
      time: "",
      guests: "",
      occasion: "",
      budgetRange: "",
      message: "",
      agreeToPolicy: false,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) { setErr(msg); return; }

    setLoading(true);
    try {
      await API.post("/inquiries", form);
      setOk("Thank you! We'll contact you shortly to confirm your request.");
      resetAfterSuccess();
    } catch (error) {
      const apiErr = error?.response?.data?.error;
      setErr(apiErr || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Fixed font sizes to prevent mobile zoom
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1,
      backgroundColor: 'white',
      '&:hover fieldset': {
        borderColor: '#fda021',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2c1000',
      }
    },
    '& .MuiInputLabel-root': {
      fontSize: { xs: '1rem', md: '1rem' }
    },
    '& .MuiOutlinedInput-input': {
      fontSize: { xs: '1rem', md: '1rem' }
    }
  };

  return (
    <Box sx={{ 
      bgcolor: '#fefcf8', 
      minHeight: '100vh',
      position: 'relative'
    }}>
      <HomepageNavbar />
      
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #2c1000 0%, #4a2000 100%)',
        color: 'white',
        py: { xs: 4, md: 6 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fda021\' fill-opacity=\'0.05\'%3E%3Cpath d=\'m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={mounted} timeout={1000}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Contact & Reservations
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#e8d5c4', 
                  maxWidth: 600, 
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  lineHeight: 1.6
                }}
              >
                Experience authentic Sri Lankan cuisine at Dissanayake Restaurant & Bakers. 
                Book your table or plan your special event with us.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 7 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' }, 
          gap: { xs: 3, lg: 4 },
          justifyContent: 'center',
          alignItems: 'flex-start',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Left Side - Contact Form */}
          <Box sx={{ flex: { lg: '0 0 55%' }, width: { xs: '100%', lg: '55%' } }}>
            <Slide direction="right" in={mounted} timeout={800}>
              <Card 
                elevation={8}
                sx={{ 
                  borderRadius: 1,
                  background: 'linear-gradient(145deg, #ffffff 0%, #fefcf8 100%)',
                  border: '1px solid #e8d5c4',
                  position: 'relative',
                  overflow: 'visible',
                  height: 'fit-content',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background: 'linear-gradient(45deg, #fda021, #e8d5c4)',
                    borderRadius: 1,
                    zIndex: -1,
                    opacity: 0.1
                  }
                }}
              >
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #2c1000 0%, #4a2000 100%)',
                  color: 'white',
                  p: { xs: 2, md: 3 },
                  borderRadius: '6px 6px 0 0',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <Restaurant sx={{ fontSize: { xs: 32, md: 40 }, mb: 1, color: '#fda021' }} />
                  <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                    {isBooking ? 'Make a Reservation' : 'Get in Touch'}
                  </Typography>
                  <Typography sx={{ color: '#e8d5c4', mt: 1, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {isBooking 
                      ? "Reserve your table or plan your special event" 
                      : "We'd love to hear from you"
                    }
                  </Typography>
                </Box>

                <CardContent sx={{ p: { xs: 2, md: 3 } }} component="form" onSubmit={onSubmit}>
                  <Stack spacing={2.5}>
                    {/* Request Type */}
                    <TextField
                      select
                      fullWidth
                      label="How can we help you?"
                      name="type"
                      value={form.type || ""}
                      onChange={onChange}
                      required
                      size="small"
                      sx={inputStyles}
                    >
                      {TYPES.map((t) => (
                        <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                      ))}
                    </TextField>

                    {/* Personal Information */}
                    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, bgcolor: '#fefcf8', borderRadius: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#2c1000', mb: 2, fontSize: { xs: '1rem', md: '1.125rem' } }}>
                        Personal Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="First Name"
                            name="firstName"
                            value={form.firstName || ""}
                            onChange={onChange}
                            fullWidth
                            required
                            size="small"
                            sx={inputStyles}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Last Name (Optional)"
                            name="lastName"
                            value={form.lastName || ""}
                            onChange={onChange}
                            fullWidth
                            size="small"
                            sx={inputStyles}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Email (Optional)"
                            name="email"
                            type="email"
                            value={form.email || ""}
                            onChange={onChange}
                            fullWidth
                            size="small"
                            placeholder="you@example.com"
                            sx={inputStyles}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Phone Number"
                            name="phone"
                            value={form.phone || ""}
                            onChange={onChange}
                            fullWidth
                            required
                            size="small"
                            placeholder="9477XXXXXXX"
                            helperText="International format (e.g., 9477XXXXXXX)"
                            inputProps={{ inputMode: "numeric", pattern: "\\d*" }}
                            sx={{
                              ...inputStyles,
                              '& .MuiFormHelperText-root': {
                                fontSize: { xs: '0.875rem', md: '0.875rem' }
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Booking Details */}
                    {isBooking && (
                      <Fade in={isBooking} timeout={500}>
                        <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, bgcolor: '#fff8f0', borderRadius: 1 }}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#2c1000', mb: 2, fontSize: { xs: '1rem', md: '1.125rem' } }}>
                            Reservation Details
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Date"
                                name="date"
                                type="date"
                                value={form.date || ""}
                                onChange={onChange}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                required
                                InputProps={{
                                  startAdornment: <CalendarToday sx={{ mr: 1, color: '#fda021', fontSize: '1rem' }} />
                                }}
                                sx={inputStyles}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Time"
                                name="time"
                                type="time"
                                value={form.time || ""}
                                onChange={onChange}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                required
                                InputProps={{
                                  startAdornment: <AccessTime sx={{ mr: 1, color: '#fda021', fontSize: '1rem' }} />
                                }}
                                sx={inputStyles}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Number of Guests"
                                name="guests"
                                type="number"
                                value={form.guests || ""}
                                onChange={onChange}
                                fullWidth
                                size="small"
                                inputProps={{ min: 1 }}
                                required
                                InputProps={{
                                  startAdornment: <People sx={{ mr: 1, color: '#fda021', fontSize: '1rem' }} />
                                }}
                                sx={inputStyles}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label="Special Occasion (Optional)"
                                name="occasion"
                                value={form.occasion || ""}
                                onChange={onChange}
                                fullWidth
                                size="small"
                                placeholder="Birthday, Anniversary, Corporate..."
                                sx={inputStyles}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label="Budget Range (Optional)"
                                name="budgetRange"
                                value={form.budgetRange || ""}
                                onChange={onChange}
                                fullWidth
                                size="small"
                                placeholder="e.g., LKR 20,000 – 50,000"
                                sx={inputStyles}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      </Fade>
                    )}

                    {/* Message */}
                    <TextField
                      label="Your Message"
                      name="message"
                      value={form.message || ""}
                      onChange={onChange}
                      fullWidth
                      multiline
                      rows={3}
                      required
                      placeholder={
                        isBooking
                          ? "Share any special requests, dietary requirements, or details about your reservation..."
                          : "Tell us about your inquiry or how we can help you..."
                      }
                      InputProps={{
                        startAdornment: <Message sx={{ mr: 1, color: '#fda021', alignSelf: 'flex-start', mt: 1, fontSize: '1rem' }} />
                      }}
                      sx={inputStyles}
                    />

                    {/* Privacy Policy */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="agreeToPolicy"
                          checked={form.agreeToPolicy || false}
                          onChange={onChange}
                          size="small"
                          sx={{
                            color: '#fda021',
                            '&.Mui-checked': {
                              color: '#2c1000',
                            }
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ color: '#2c1000', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                          I agree to the{" "}
                          <Button 
                            href="/privacy" 
                            size="small" 
                            sx={{ 
                              color: '#fda021', 
                              textDecoration: 'underline',
                              fontSize: { xs: '0.8rem', md: '0.875rem' },
                              minWidth: 'auto',
                              p: 0,
                              '&:hover': { color: '#2c1000' }
                            }}
                          >
                            Privacy Policy
                          </Button>
                        </Typography>
                      }
                    />

                    {/* Error Alert */}
                    {err && (
                      <Fade in={!!err}>
                        <Alert 
                          severity="error" 
                          sx={{ 
                            borderRadius: 1,
                            fontSize: { xs: '0.8rem', md: '0.875rem' },
                            '& .MuiAlert-icon': {
                              color: '#d32f2f'
                            }
                          }}
                        >
                          {err}
                        </Alert>
                      </Fade>
                    )}

                    {/* Submit Button */}
                    <LoadingButton
                      loading={loading}
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        bgcolor: '#2c1000',
                        py: { xs: 1.2, md: 1.5 },
                        borderRadius: 2,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 20px rgba(44, 16, 0, 0.3)',
                        '&:hover': {
                          bgcolor: '#4a2000',
                          boxShadow: '0 6px 25px rgba(44, 16, 0, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isBooking ? 'Book My Table' : 'Send Message'}
                    </LoadingButton>

                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      textAlign="center"
                      sx={{ mt: 2, fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                    >
                      We'll confirm your {isBooking ? 'reservation' : 'inquiry'} within 24 hours. 
                      For urgent requests, please call us directly.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Slide>
          </Box>

          {/* Right Side - Contact Information & Opening Hours */}
          <Box sx={{ flex: { lg: '0 0 40%' }, width: { xs: '100%', lg: '40%' } }}>
            <Slide direction="left" in={mounted} timeout={1000}>
              <Stack spacing={4}>
                {/* Contact Information Card */}
                <Card 
                  elevation={8}
                  sx={{ 
                    borderRadius: 1,
                    background: 'linear-gradient(145deg, #2c1000 0%, #4a2000 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(253, 160, 33, 0.1)',
                  }} />
                  <CardContent sx={{ p: { xs: 2.5, md: 3 }, position: 'relative', zIndex: 1 }}>
                    <Typography variant="h5" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                      Dissanayake Restaurant & Bakers
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#e8d5c4', mb: 2.5, lineHeight: 1.6, fontSize: { xs: '0.85rem', md: '0.9rem' } }}>
                      Authentic Sri Lankan cuisine crafted with love and tradition. 
                      Join us for an unforgettable dining experience.
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                          size="small"
                          sx={{ 
                            bgcolor: '#fda021', 
                            color: 'white', 
                            mr: 2,
                            width: { xs: 35, md: 40 },
                            height: { xs: 35, md: 40 },
                            '&:hover': { bgcolor: '#e8930b' }
                          }}
                        >
                          <Phone fontSize="small" />
                        </IconButton>
                        <Box>
                          <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', md: '0.9rem' } }}>
                            +94 77 750 6319
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#e8d5c4', fontSize: { xs: '0.75rem', md: '0.8rem' } }}>
                            Available 8:00 AM - 10:00 PM
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                          size="small"
                          sx={{ 
                            bgcolor: '#fda021', 
                            color: 'white', 
                            mr: 2,
                            width: { xs: 35, md: 40 },
                            height: { xs: 35, md: 40 },
                            '&:hover': { bgcolor: '#e8930b' }
                          }}
                        >
                          <Email fontSize="small" />
                        </IconButton>
                        <Box>
                          <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', md: '0.9rem' } }}>
                            Dissanayakesuper20@gmail.com
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#e8d5c4', fontSize: { xs: '0.75rem', md: '0.8rem' } }}>
                            We'll respond within 24 hours
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <IconButton 
                          size="small"
                          sx={{ 
                            bgcolor: '#fda021', 
                            color: 'white', 
                            mr: 2,
                            width: { xs: 35, md: 40 },
                            height: { xs: 35, md: 40 },
                            '&:hover': { bgcolor: '#e8930b' }
                          }}
                        >
                          <LocationOn fontSize="small" />
                        </IconButton>
                        <Box>
                          <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', md: '0.9rem' } }}>
                            No.20, Colombo Road, Pothuhera
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#e8d5c4', fontSize: { xs: '0.75rem', md: '0.8rem' } }}>
                            Sri Lanka
                          </Typography>
                          <Button 
                            variant="text" 
                            size="small" 
                            href="https://maps.app.goo.gl/r5CYR78bMnCQiN6Y8"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              color: '#fda021', 
                              mt: 0.5, 
                              textTransform: 'none',
                              fontSize: { xs: '0.75rem', md: '0.8rem' },
                              minWidth: 'auto',
                              p: 0,
                              '&:hover': { color: '#e8930b' }
                            }}
                          >
                            Get Directions →
                          </Button>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Opening Hours Card */}
                <Card 
                  elevation={8}
                  sx={{ 
                    borderRadius: 1,
                    background: 'linear-gradient(145deg, #ffffff 0%, #fefcf8 100%)',
                    border: '2px solid #e8d5c4'
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: '#2c1000', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                      Opening Hours
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: '#e8d5c4' }} />
                    <Stack spacing={1}>
                      {[
                        { day: 'Monday - Friday', hours: '7:00 AM - 10:00 PM' },
                        { day: 'Saturday - Sunday', hours: '7:00 AM - 10:00 PM' },
                        // { day: 'Sunday', hours: '9:00 AM - 10:00 PM' }
                      ].map((item, index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            p: { xs: 1, md: 1.5 },
                            borderRadius: 2,
                            bgcolor: index === 1 ? '#fff8f0' : 'transparent'
                          }}
                        >
                          <Typography variant="body1" fontWeight={500} sx={{ color: '#2c1000', fontSize: { xs: '0.8rem', md: '0.95rem' } }}>
                            {item.day}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fda021', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.9rem' } }}>
                            {item.hours}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Slide>
          </Box>
        </Box>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={!!ok}
        autoHideDuration={6000}
        onClose={() => setOk("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setOk("")} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: '#2e7d32'
            }
          }}
        >
          {ok}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
}
        