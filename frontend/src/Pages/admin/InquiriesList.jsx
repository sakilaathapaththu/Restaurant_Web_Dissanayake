import * as React from "react";
import {
  Box, Card, CardContent, CardHeader, Divider, Stack, TextField, MenuItem,
  Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Tooltip
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";
import API from "../../Utils/api";
import ResponsiveLayout from "../../Components/Dashboard/ResponsiveLayout";

const TYPE_COLORS = { question: "default", reservation: "success", event: "warning" };

export default function InquiriesList() {
  const [rows, setRows] = React.useState([]);
  const [type, setType] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [q, setQ] = React.useState("");

  const fetchRows = async () => {
    const { data } = await API.get("/inquiries", { params: { type, status, q } });
    setRows(data.data || []);
  };
  React.useEffect(() => { fetchRows(); }, [type, status]);

  return (
    <ResponsiveLayout title="Inquiries">
      <Box sx={{ p: 2 }}>
        <Card>
          <CardHeader title="Customer Inquiries"
            subheader="Questions, reservations, and special events" />
          <Divider />
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
              <TextField select label="Type" value={type} onChange={(e) => setType(e.target.value)} sx={{ minWidth: 180 }}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="question">Question</MenuItem>
                <MenuItem value="reservation">Reservation</MenuItem>
                <MenuItem value="event">Special Event</MenuItem>
              </TextField>
              <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 180 }}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="seen">Seen</MenuItem>
                <MenuItem value="handled">Handled</MenuItem>
              </TextField>
              <TextField label="Search" value={q} onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchRows()} fullWidth
                placeholder="Name, phone, email, message…" />
            </Stack>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r._id} hover>
                    <TableCell><Chip label={r.type} color={TYPE_COLORS[r.type]} size="small" /></TableCell>
                    <TableCell>{r.firstName} {r.lastName}</TableCell>
                    <TableCell>{r.phone}<br />{r.email}</TableCell>
                    <TableCell>
                      {r.date && <>Date: {r.date}<br/></>}
                      {r.time && <>Time: {r.time}<br/></>}
                      {r.guests && <>Guests: {r.guests}<br/></>}
                      {r.occasion && <>Occasion: {r.occasion}<br/></>}
                      {r.budgetRange && <>Budget: {r.budgetRange}<br/></>}
                      {r.message}
                    </TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Mark Seen">
                        <IconButton onClick={async () => {
                          await API.patch(`/inquiries/${r._id}/status`, { status: "seen" });
                          fetchRows();
                        }}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Mark Handled">
                        <IconButton onClick={async () => {
                          await API.patch(`/inquiries/${r._id}/status`, { status: "handled" });
                          fetchRows();
                        }}>
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </ResponsiveLayout>
  );
}
