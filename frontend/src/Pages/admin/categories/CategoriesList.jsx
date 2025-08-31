
import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Table, TableHead, TableBody, TableRow, TableCell,
  Chip, Switch, Button, Stack, IconButton, Tooltip, Snackbar, Alert
} from "@mui/material";
import ResponsiveLayout from "../../../Components/Dashboard/ResponsiveLayout";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../../../Utils/api";
import {
  Dialog, DialogTitle, DialogContent
} from "@mui/material";

export default function CategoriesList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [includeAll, setIncludeAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null); // category row

  const fetchRows = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/categories${includeAll ? "?all=true" : ""}`);
      setRows(data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRows(); /* eslint-disable-next-line */ }, [includeAll]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(r =>
      r.name?.toLowerCase().includes(needle) ||
      r.categoryId?.toLowerCase().includes(needle) ||
      (r.portions || []).some(p => p?.toLowerCase().includes(needle))
    );
  }, [rows, q]);

  const openEdit = (row) => {
    setSelected(row);
    setEditOpen(true);
  };

  const onSaved = (updated) => {
    setRows(prev => prev.map(r => (r._id === updated._id ? updated : r)));
    setToast({ open: true, msg: "Category updated", severity: "success" });
  };

  const handleToggle = async (row) => {
    const next = !row.isActive;
    const ok = window.confirm(`Are you sure you want to ${next ? "activate" : "deactivate"} "${row.name}"?`);
    if (!ok) return;
    try {
      await API.patch(`/categories/${row._id}`, { isActive: next });
      // If "Active only" view and we deactivated → refetch to hide it
      if (!includeAll && !next) {
        await fetchRows();
      } else {
        setRows(prev => prev.map(r => (r._id === row._id ? { ...r, isActive: next } : r)));
      }
      setToast({ open: true, msg: next ? "Activated" : "Deactivated", severity: "success" });
    } catch (e) {
      const msg = e?.response?.data?.error || "Failed to update status";
      setToast({ open: true, msg, severity: "error" });
    }
  };

  return (
    <ResponsiveLayout>
      <Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, gap: 2 }}>
          <Typography variant="h5" fontWeight={700}>Categories</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField size="small" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">Active only</Typography>
              <Switch checked={!includeAll} onChange={e => setIncludeAll(!e.target.checked)} />
            </Stack>
            <Button onClick={fetchRows} startIcon={<RefreshIcon />} disabled={loading}>Refresh</Button>
            <Button onClick={() => navigate("/categories/new")} startIcon={<AddIcon />} variant="contained">
              Add Category
            </Button>
          </Stack>
        </Stack>

        <Card sx={{ borderRadius: 3, boxShadow: 8 }}>
          <CardContent sx={{ p: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Portions</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 160 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>{r.order ?? 0}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.categoryId}</TableCell>
                    <TableCell>
                      {(r.portions || []).length
                        ? r.portions.map(p => <Chip key={p} label={p} size="small" sx={{ mr: .5, mb: .5 }} />)
                        : <Typography variant="body2" color="text.secondary">—</Typography>}
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={r.isActive ? "Active" : "Inactive"} color={r.isActive ? "success" : "default"} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(r)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={r.isActive ? "Deactivate" : "Activate"}>
                          <IconButton size="small" onClick={() => handleToggle(r)} color={r.isActive ? "success" : "default"}>
                            {r.isActive ? <ToggleOnIcon fontSize="small" /> : <ToggleOffIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!filtered.length && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" style={{ padding: 24 }}>
                      {loading ? "Loading..." : "No categories found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>

      {/* Edit Dialog */}
      {selected && (
        <EditCategoryDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          category={selected}
          onSaved={onSaved}
        />
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </ResponsiveLayout>
  );
}

/** Inline component for editing a category */
function EditCategoryDialog({ open, onClose, category, onSaved }) {
  const [name, setName] = useState(category.name || "");
  const [portions, setPortions] = useState((category.portions || []).join(", "));
  const [order, setOrder] = useState(category.order ?? 0);
  const [description, setDescription] = useState(category.description || "");
  const [isActive, setIsActive] = useState(!!category.isActive);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  React.useEffect(() => {
    if (!open) return;
    setName(category.name || "");
    setPortions((category.portions || []).join(", "));
    setOrder(category.order ?? 0);
    setDescription(category.description || "");
    setIsActive(!!category.isActive);
    setErr("");
  }, [open, category]);

  const handleSave = async () => {
    if (!name.trim()) {
      setErr("Name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        portions: portions
          ? portions.split(",").map(p => p.trim()).filter(Boolean)
          : [],
        order: Number(order) || 0,
        description: description?.trim(),
        isActive
      };
      const { data } = await API.patch(`/categories/${category._id}`, payload);
      onSaved?.(data?.data || category);
      onClose?.();
    } catch (e) {
      const msg = e?.response?.data?.error || "Update failed";
      setErr(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogTemplate
      open={open}
      title="Edit Category"
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
      err={err}
    >
      <Stack spacing={2}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => { setName(e.target.value); setErr(""); }}
          fullWidth
          required
        />
        <TextField
          label="Portion labels (comma-separated)"
          value={portions}
          onChange={(e) => setPortions(e.target.value)}
          fullWidth
          placeholder="full, normal, 1person"
        />
        <TextField
          label="Order"
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline minRows={2}
        />
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2">Active</Typography>
          <Switch checked={isActive} onChange={e => setIsActive(e.target.checked)} />
        </Stack>
      </Stack>
    </DialogTemplate>
  );
}

/** Small generic dialog template */
function DialogTemplate({ open, title, children, onClose, onSave, saving, err }) {
  return (
    <Box>
      <SimpleDialog open={open} onClose={onClose} title={title}>
        {children}
        {err && <Typography color="error" mt={1} fontSize={13}>{err}</Typography>}
        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={onSave} variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </SimpleDialog>
    </Box>
  );
}

/** Very lightweight dialog built from MUI primitives */

function SimpleDialog({ open, onClose, title, children }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
    </Dialog>
  );
}
