
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Table, TableHead, TableBody, TableRow, TableCell,
  Chip, Switch, Button, Stack, IconButton, Tooltip, Snackbar, Alert, Avatar
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon, Edit as EditIcon } from "@mui/icons-material";
import ResponsiveLayout from "../../../Components/Dashboard/ResponsiveLayout";
import API from "../../../Utils/api";
import { useNavigate } from "react-router-dom";

const money = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(Number(n || 0));

// Build absolute API origin for <img src>, e.g. http://localhost:5000
const API_ORIGIN = (API?.defaults?.baseURL || "").replace(/\/api\/?$/, "");

export default function ItemsList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [includeAll, setIncludeAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [okOpen, setOkOpen] = useState(false);
  const [errOpen, setErrOpen] = useState({ open: false, msg: "" });

  // track which rows failed to load an image (hide broken imgs)
  const [imgFail, setImgFail] = useState(() => new Set());

  const imgUrl = (r) => `${API_ORIGIN}/api/menu-items/${r.menuId || r._id}/image`;
  const markImgFailed = (key) =>
    setImgFail((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });

  const fetchRows = async () => {
    setLoading(true);
    try {
      const query = includeAll ? "" : "?active=true";
      const { data } = await API.get(`/menu-items${query}`);
      setRows(data?.data || []);
      // reset failure set when data changes
      setImgFail(new Set());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRows(); /* eslint-disable-next-line */ }, [includeAll]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      r.name?.toLowerCase().includes(s) ||
      r.menuId?.toLowerCase().includes(s) ||
      r.categoryName?.toLowerCase().includes(s) ||
      r.categoryId?.toLowerCase().includes(s) ||
      (r.portions || []).some((p) => p.label?.toLowerCase().includes(s))
    );
  }, [rows, q]);

  const toggleActive = async (row) => {
    const newVal = !row.isActive;

    // optimistic UI
    setRows((prev) => prev.map((r) => (r._id === row._id ? { ...r, isActive: newVal } : r)));

    try {
      await API.patch(`/menu-items/${row._id}`, { isActive: newVal });
      setOkOpen(true);
    } catch (e) {
      // revert on error
      setRows((prev) => prev.map((r) => (r._id === row._id ? { ...r, isActive: !newVal } : r)));
      const msg = e?.response?.data?.error || "Failed to update status";
      setErrOpen({ open: true, msg });
    }
  };

  return (
    <ResponsiveLayout>
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, gap: 2 }}>
          <Typography variant="h5" fontWeight={700}>Menu Items</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField size="small" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">Active only</Typography>
              <Switch checked={!includeAll} onChange={(e) => setIncludeAll(!e.target.checked)} />
            </Stack>
            <Button onClick={fetchRows} startIcon={<RefreshIcon />} disabled={loading}>Refresh</Button>
            <Button onClick={() => navigate("/items/new")} startIcon={<AddIcon />} variant="contained">
              Add Item
            </Button>
          </Stack>
        </Stack>

        <Card sx={{ borderRadius: 3, boxShadow: 8 }}>
          <CardContent sx={{ p: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: 80 }}>Image</TableCell>{/* ⭐️ new */}
                  <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Menu ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: 280 }}>Portions (price → final)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Active</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 180 }} align="right">Actions</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 140 }} align="right">Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((r) => {
                  const key = r._id || r.menuId;
                  const showImg = r.hasImage !== false && !imgFail.has(key); // prefer hasImage when present
                  return (
                    <TableRow key={r._id}>
                      {/* ⭐️ Image cell */}
                      <TableCell>
                        {showImg ? (
                          <Box
                            component="img"
                            src={imgUrl(r)}
                            alt={r.name}
                            sx={{
                              width: 56, height: 56, objectFit: "cover",
                              borderRadius: 1, border: "1px solid", borderColor: "divider"
                            }}
                            onError={() => markImgFailed(key)}
                          />
                        ) : (
                          <Avatar
                            variant="rounded"
                            sx={{ width: 56, height: 56, bgcolor: "action.hover", color: "text.secondary", fontSize: 14 }}
                          >
                            No Img
                          </Avatar>
                        )}
                      </TableCell>

                      <TableCell>{r.order ?? 0}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.menuId}</TableCell>
                      <TableCell>{r.categoryName || r.categoryId}</TableCell>
                      <TableCell>
                        {(r.portions || []).length ? (
                          <Stack direction="row" flexWrap="wrap" gap={0.5}>
                            {r.portions.map((p) => {
                              const base = money(p.price);
                              const final = money(p.finalPrice ?? p.price);
                              const discounted = p?.discount?.active && (p.finalPrice ?? p.price) !== p.price;
                              return (
                                <Chip
                                  key={p.label}
                                  size="small"
                                  label={discounted ? `${p.label}: ${base} → ${final}` : `${p.label}: ${final}`}
                                  color={discounted ? "success" : "default"}
                                />
                              );
                            })}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">—</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            r.itemStatus === "available" ? "Available" :
                            r.itemStatus === "out_of_stock" ? "Out of stock" : "Unavailable"
                          }
                          color={r.itemStatus === "available" ? "success" : "default"}
                        />
                      </TableCell>

                      {/* Active indicator (read-only) */}
                      <TableCell>
                        <Chip size="small" label={r.isActive ? "Active" : "Inactive"} color={r.isActive ? "success" : "default"} />
                      </TableCell>

                      {/* Actions: Toggle Active + Edit */}
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                          <Tooltip title={r.isActive ? "Deactivate" : "Activate"}>
                            <Switch
                              checked={!!r.isActive}
                              onChange={() => toggleActive(r)}
                              inputProps={{ "aria-label": "toggle active" }}
                            />
                          </Tooltip>

                          <Tooltip title="Edit">
                            <IconButton color="primary" onClick={() => navigate(`/items/${r._id}/edit`)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell align="right">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {!filtered.length && (
                  <TableRow>
                    {/* increased colspan by 1 because we added Image column */}
                    <TableCell colSpan={10} align="center" style={{ padding: 24 }}>
                      {loading ? "Loading..." : "No items found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>

      <Snackbar open={okOpen} autoHideDuration={2000} onClose={() => setOkOpen(false)}>
        <Alert severity="success" variant="filled" onClose={() => setOkOpen(false)}>
          Updated successfully
        </Alert>
      </Snackbar>

      <Snackbar open={errOpen.open} autoHideDuration={3000} onClose={() => setErrOpen({ open: false, msg: "" })}>
        <Alert severity="error" variant="filled" onClose={() => setErrOpen({ open: false, msg: "" })}>
          {errOpen.msg}
        </Alert>
      </Snackbar>
    </ResponsiveLayout>
  );
}
