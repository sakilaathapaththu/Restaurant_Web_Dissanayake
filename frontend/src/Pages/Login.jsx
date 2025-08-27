// src/pages/Login.jsx
import React, { useState } from "react";
import { Box, Card, CardContent, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material";
import API from "../Utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [err, setErr] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await API.post("/admins/login", form);
      localStorage.setItem("token", data.token);
      // You can store some admin fields if you want:
      localStorage.setItem("admin", JSON.stringify(data.admin));
      navigate("/dashboard"); // change to your route
    } catch (error) {
      const msg = error?.response?.data?.error || "Login failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "grid", placeItems: "center", p: 2 }}>
      <Card sx={{ width: 400, maxWidth: "96vw", borderRadius: 3, boxShadow: 8 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Admin Login
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Sign in with your username or email
          </Typography>

          <Box component="form" onSubmit={onSubmit} noValidate>
            <TextField
              label="Username or Email"
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              onChange={onChange}
              fullWidth
              margin="normal"
              autoComplete="username"
              required
            />

            <TextField
              label="Password"
              name="password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              fullWidth
              margin="normal"
              autoComplete="current-password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd((s) => !s)} aria-label="toggle password visibility" edge="end">
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {!!err && (
              <Typography color="error" mt={1} fontSize={13}>
                {err}
              </Typography>
            )}

            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={<LoginIcon />}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, py: 1.25 }}
            >
              Sign In
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
