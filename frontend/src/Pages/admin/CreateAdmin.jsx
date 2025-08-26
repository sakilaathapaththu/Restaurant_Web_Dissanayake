// src/Pages/admin/CreateAdmin.jsx
import * as React from "react";
import { Box, Card, CardContent, Grid, TextField, MenuItem, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import API from "../../Utils/api";
import ResponsiveLayout from "../../Components/Dashboard/ResponsiveLayout";

export default function CreateAdmin() {
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [ok, setOk] = React.useState("");
  const [fieldErr, setFieldErr] = React.useState({});
  const [form, setForm] = React.useState({
    firstName: "", lastName: "", adminId: "", username: "", email: "",
    password: "", role: "editor", contactNo: ""
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setFieldErr((fe) => ({ ...fe, [name]: "" }));
    setErr(""); setOk("");
  };

  // Live availability (works if your /admins/check considers both adminId & employeeId)
  React.useEffect(() => {
    const t = setTimeout(async () => {
      const params = {};
      if (form.email) params.email = form.email;
      if (form.username) params.username = form.username;
      if (form.adminId) params.adminId = form.adminId;
      if (!Object.keys(params).length) return;

      try {
        const { data } = await API.get("/admins/check", { params });
        const fe = {};
        if (data?.available?.email === false) fe.email = "Email already in use";
        if (data?.available?.username === false) fe.username = "Username already in use";
        if (data?.available?.adminId === false) fe.adminId = "Admin ID already in use";
        setFieldErr(fe);
      } catch {
        // ignore availability errors
      }
    }, 300);
    return () => clearTimeout(t);
  }, [form.email, form.username, form.adminId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setOk(""); setLoading(true); setFieldErr({});
    try {
      const { data } = await API.post("/admins/register", form);
      setOk(`Created ${data?.admin?.username || "admin"} (${data?.admin?.role}).`);
      // optional: clear form after success
      // setForm({ firstName:"", lastName:"", adminId:"", username:"", email:"", password:"", role:"editor", contactNo:"" });
    } catch (error) {
      const resp = error?.response;
      // Map duplicates precisely, including legacy "employeeId"
      if (resp?.status === 409) {
        const fields = resp.data?.fields || {};
        const fe = {};
        if (fields.email) fe.email = "Email already in use";
        if (fields.username) fe.username = "Username already in use";
        if (fields.adminId || fields.employeeId) fe.adminId = "Admin ID already in use";
        setFieldErr(fe);

        const rawMsg = resp.data?.message || resp.data?.error || "Duplicate value";
        setErr(rawMsg.includes("employeeId") ? "Admin ID already in use" : rawMsg);
      } else if (resp?.status === 403) {
        setErr("You don't have permission to create admins (superadmin only).");
      } else {
        setErr(resp?.data?.error || "Failed to create admin");
      }
    } finally {
      setLoading(false);
    }
  };

  const hasFieldConflicts = !!(fieldErr.email || fieldErr.username || fieldErr.adminId);

  return (
    <ResponsiveLayout title="Create Admin">
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 6 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Create Admin
              </Typography>

              <Box component="form" onSubmit={onSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField name="firstName" label="First name" value={form.firstName}
                      onChange={onChange} fullWidth required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField name="lastName" label="Last name" value={form.lastName}
                      onChange={onChange} fullWidth required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField name="adminId" label="Admin ID" value={form.adminId}
                      onChange={onChange} fullWidth required
                      error={!!fieldErr.adminId} helperText={fieldErr.adminId} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField name="contactNo" label="Contact No" value={form.contactNo}
                      onChange={onChange} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField name="username" label="Username" value={form.username}
                      onChange={onChange} fullWidth required
                      error={!!fieldErr.username} helperText={fieldErr.username} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField name="email" type="email" label="Email" value={form.email}
                      onChange={onChange} fullWidth required
                      error={!!fieldErr.email} helperText={fieldErr.email} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField name="password" type="password" label="Password"
                      value={form.password} onChange={onChange} fullWidth required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField name="role" select label="Role" value={form.role}
                      onChange={onChange} fullWidth>
                      <MenuItem value="editor">Editor</MenuItem>
                      <MenuItem value="superadmin">Super Admin</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                {!!err && <Typography color="error" mt={2}>{err}</Typography>}
                {!!ok && <Typography sx={{ mt: 2, color: "success.main" }}>{ok}</Typography>}

                <LoadingButton
                  loading={loading}
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3 }}
                  disabled={hasFieldConflicts}
                >
                  Create Admin
                </LoadingButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ResponsiveLayout>
  );
}
