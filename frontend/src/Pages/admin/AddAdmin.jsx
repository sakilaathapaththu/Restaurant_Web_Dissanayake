// src/pages/admin/AddAdmin.jsx
import React, { useState } from "react";
import {
  Box, Card, CardContent, Grid, TextField, Typography, IconButton, InputAdornment, MenuItem, Snackbar, Alert
} from "@mui/material";
  import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import API from "../../Utils/api";
import ResponsiveLayout from "../../Components/Dashboard/ResponsiveLayout";

const ROLES = [
  { label: "Super Admin", value: "superadmin" },
  { label: "Editor", value: "editor" },
];

export default function AddAdmin() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [okOpen, setOkOpen] = useState(false);
  const [fieldErr, setFieldErr] = useState({});
  const [form, setForm] = useState({
    firstName: "", lastName: "", adminId: "",
    username: "", email: "", password: "",
    role: "editor", contactNo: ""
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setFieldErr((fe) => ({ ...fe, [name]: "" }));
    setErr("");
  };

  const validate = () => {
    const fe = {};
    if (!form.firstName.trim()) fe.firstName = "Required";
    if (!form.lastName.trim()) fe.lastName = "Required";
    if (!form.adminId.trim()) fe.adminId = "Required";
    if (!form.username.trim()) fe.username = "Required";
    if (!form.email.trim()) fe.email = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) fe.email = "Invalid email";
    if (!form.password || form.password.length < 6) fe.password = "Min 6 characters";
    if (!form.role) fe.role = "Required";
    setFieldErr(fe);
    return Object.keys(fe).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setErr("");

    try {
      await API.post("/admins", form); // token auto-attached by interceptor
      setOkOpen(true);
      setForm({ firstName:"", lastName:"", adminId:"", username:"", email:"", password:"", role:"editor", contactNo:"" });
    } catch (error) {
      const msg = error?.response?.data?.error || "Creation failed";
      if (/E11000|exists|duplicate/i.test(msg)) {
        const fe = {};
        if (/email/i.test(msg)) fe.email = "Email already in use";
        if (/username/i.test(msg)) fe.username = "Username already in use";
        if (/adminId/i.test(msg)) fe.adminId = "Admin ID already in use";
        setFieldErr((prev) => ({ ...prev, ...fe }));
      } else {
        setErr(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveLayout>
      <Box sx={{ maxWidth: 780, mx: "auto", p: 2 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 8 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Create Admin</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Only Super Admins can create other admins.
            </Typography>

            <Box component="form" onSubmit={onSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="First Name" name="firstName" value={form.firstName} onChange={onChange}
                             fullWidth required error={!!fieldErr.firstName} helperText={fieldErr.firstName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Last Name" name="lastName" value={form.lastName} onChange={onChange}
                             fullWidth required error={!!fieldErr.lastName} helperText={fieldErr.lastName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Admin ID" name="adminId" value={form.adminId} onChange={onChange}
                             fullWidth required error={!!fieldErr.adminId} helperText={fieldErr.adminId || "e.g., ADM001"} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select label="Role" name="role" value={form.role} onChange={onChange}
                             fullWidth required error={!!fieldErr.role} helperText={fieldErr.role || "Select role"}>
                    {ROLES.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Username" name="username" value={form.username} onChange={onChange}
                             fullWidth required error={!!fieldErr.username} helperText={fieldErr.username} autoComplete="username" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Email" name="email" type="email" value={form.email} onChange={onChange}
                             fullWidth required error={!!fieldErr.email} helperText={fieldErr.email} autoComplete="email" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password" name="password" type={showPwd ? "text" : "password"} value={form.password} onChange={onChange}
                    fullWidth required error={!!fieldErr.password} helperText={fieldErr.password || "Min 6 characters"} autoComplete="new-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPwd(s => !s)} edge="end" aria-label="toggle password visibility">
                            {showPwd ? <VisibilityOff/> : <Visibility/>}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Contact No (optional)" name="contactNo" value={form.contactNo} onChange={onChange} fullWidth />
                </Grid>
              </Grid>

              {!!err && <Typography color="error" mt={2} fontSize={13}>{err}</Typography>}

              <LoadingButton loading={loading} loadingPosition="start" startIcon={<PersonAddIcon />}
                             type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.25 }}>
                Create Admin
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>

        <Snackbar open={okOpen} autoHideDuration={3000} onClose={() => setOkOpen(false)}>
          <Alert severity="success" variant="filled" onClose={() => setOkOpen(false)}>Admin created successfully</Alert>
        </Snackbar>
      </Box>
    </ResponsiveLayout>
  );
}
