// src/pages/items/AddItem.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box, Card, CardContent, Grid, TextField, Typography, Snackbar, Alert, Stack, IconButton,
  Tooltip, Button, Divider, Chip, Switch, MenuItem, InputAdornment, Paper, FormControlLabel, Select
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ResponsiveLayout from "../../../Components/Dashboard/ResponsiveLayout";
import API from "../../../Utils/api";
import { useNavigate } from "react-router-dom";

const ID_PREFIX = "ITEM";
const ID_MIN_WIDTH = 3;

const money = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(Number(n || 0));

function computeNextId(ids, prefix = ID_PREFIX, minWidth = ID_MIN_WIDTH) {
  const re = new RegExp(`^${prefix}(\\d+)$`, "i");
  let maxN = 0;
  for (const id of ids) {
    const m = String(id || "").match(re);
    if (m) maxN = Math.max(maxN, parseInt(m[1], 10));
  }
  const next = maxN + 1;
  const width = Math.max(minWidth, String(next).length);
  return `${prefix}${String(next).padStart(width, "0")}`;
}

function finalPrice(price, discount) {
  const p = Number(price || 0);
  if (!discount?.active) return p;
  if (discount.type === "amount") {
    return Math.max(0, p - Number(discount.value || 0));
  }
  const pct = Math.min(100, Math.max(0, Number(discount.value || 0)));
  return Math.max(0, p - (p * pct) / 100);
}

export default function AddItem() {
  const navigate = useNavigate();

  const [menuId, setMenuId] = useState("");
  const [idLoading, setIdLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);

  const [itemStatus, setItemStatus] = useState("available"); // "available" | "out_of_stock" | "unavailable"
  const [isActive, setIsActive] = useState(true);

  const [portions, setPortions] = useState([
    { label: "", price: "", discount: { active: false, type: "percent", value: 0 } },
  ]);

  const [err, setErr] = useState("");
  const [fieldErr, setFieldErr] = useState({});
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.categoryId === categoryId),
    [categories, categoryId]
  );
  const allowedLabels = selectedCategory?.portions || [];

  const fetchNextMenuId = useCallback(async () => {
    setIdLoading(true);
    try {
      const { data } = await API.get("/menu-items"); // returns ALL by default in your backend
      const ids = (data?.data || []).map((i) => i.menuId).filter(Boolean);
      setMenuId(computeNextId(ids));
    } catch (e) {
      setMenuId(`${ID_PREFIX}${"1".padStart(ID_MIN_WIDTH, "0")}`);
    } finally {
      setIdLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const { data } = await API.get("/categories"); // active only
      setCategories(data?.data || []);
      // preselect first category
      if ((data?.data || []).length) {
        setCategoryId(data.data[0].categoryId);
        setCategoryName(data.data[0].name);
      }
    } finally {
      setCatLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNextMenuId();
    fetchCategories();
  }, [fetchNextMenuId, fetchCategories]);

  useEffect(() => {
    const cat = categories.find((c) => c.categoryId === categoryId);
    setCategoryName(cat?.name || "");
  }, [categoryId, categories]);

  const addPortion = () => {
    setPortions((ps) => [
      ...ps,
      { label: "", price: "", discount: { active: false, type: "percent", value: 0 } },
    ]);
  };

  const removePortion = (idx) => {
    setPortions((ps) => ps.filter((_, i) => i !== idx));
  };

  const updatePortion = (idx, updater) => {
    setPortions((ps) => ps.map((p, i) => (i === idx ? updater(p) : p)));
  };

  const validate = () => {
    const fe = {};
    if (!menuId.trim()) fe.menuId = "Required";
    if (!categoryId.trim()) fe.categoryId = "Required";
    if (!name.trim()) fe.name = "Required";

    const cleaned = portions
      .map((p) => ({
        ...p,
        label: String(p.label || "").trim(),
        price: Number(p.price),
        discount: {
          active: !!p?.discount?.active,
          type: p?.discount?.type === "amount" ? "amount" : "percent",
          value: Number(p?.discount?.value || 0),
        },
      }))
      .filter((p) => p.label);

    if (!cleaned.length) fe.portions = "At least one portion is required";
    cleaned.forEach((p, i) => {
      if (isNaN(p.price) || p.price < 0) fe[`portion_price_${i}`] = "Invalid price";
      if (p.discount.active) {
        if (p.discount.type === "percent" && (p.discount.value < 0 || p.discount.value > 100)) {
          fe[`portion_disc_${i}`] = "Percent 0–100";
        }
        if (p.discount.type === "amount" && p.discount.value < 0) {
          fe[`portion_disc_${i}`] = "Amount ≥ 0";
        }
      }
      if (allowedLabels.length) {
        const ok = allowedLabels.map(String).map((x) => x.toLowerCase()).includes(p.label.toLowerCase());
        if (!ok) fe[`portion_label_${i}`] = `Allowed: ${allowedLabels.join(", ")}`;
      }
    });

    setFieldErr(fe);
    return Object.keys(fe).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        menuId,
        categoryId,
        categoryName, // snapshot
        name: name.trim(),
        description: description?.trim(),
        order: Number(order) || 0,
        isActive,
        itemStatus,
        portions: portions
          .map((p) => ({
            label: String(p.label || "").trim(),
            price: Number(p.price),
            discount: {
              active: !!p?.discount?.active,
              type: p?.discount?.type === "amount" ? "amount" : "percent",
              value: Number(p?.discount?.value || 0),
            },
          }))
          .filter((p) => p.label && !isNaN(p.price)),
      };

      try {
        await API.post("/menu-items", payload);
      } catch (e1) {
        const msg = e1?.response?.data?.error || "";
        if (/menuId|E11000|duplicate/i.test(msg)) {
          // regenerate and retry once
          await fetchNextMenuId();
          await API.post("/menu-items", { ...payload, menuId });
        } else {
          throw e1;
        }
      }

      setOk(true);
      // reset for next
      setName(""); setDescription(""); setOrder(0); setIsActive(true); setItemStatus("available");
      setPortions([{ label: "", price: "", discount: { active: false, type: "percent", value: 0 } }]);
      fetchNextMenuId();
    } catch (error) {
      const msg = error?.response?.data?.error || "Failed to create item";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = (_e, reason) => {
    if (reason === "clickaway") return;
    setOk(false);
    navigate("/items", { replace: true });
  };

  const disabledForm = catLoading || !categories.length;

  return (
    <ResponsiveLayout>
      <Box sx={{ maxWidth: 980, mx: "auto", p: 2 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 8 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="h5" fontWeight={700}>Add Menu Item</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {idLoading ? "Generating ID…" : menuId ? `Next ID: ${menuId}` : "—"}
                </Typography>
                <Tooltip title="Regenerate menu ID from database">
                  <span>
                    <IconButton onClick={fetchNextMenuId} disabled={idLoading} size="small">
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Stack>

            {!categories.length && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                No categories found. Please create a category first.
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Menu ID (auto)"
                    value={menuId}
                    fullWidth required disabled
                    error={!!fieldErr.menuId} helperText={fieldErr.menuId || "Auto-generated like ITEM001"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Category"
                    value={categoryId}
                    onChange={(e) => { setCategoryId(e.target.value); setFieldErr((fe) => ({ ...fe, categoryId: "" })); }}
                    fullWidth required disabled={disabledForm}
                    error={!!fieldErr.categoryId} helperText={fieldErr.categoryId || ""}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c._id} value={c.categoryId}>{c.name} ({c.categoryId})</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {allowedLabels?.length ? (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Allowed portion labels for <b>{categoryName}</b>: {allowedLabels.join(", ")}
                    </Typography>
                  </Grid>
                ) : null}

                <Grid item xs={12} sm={8}>
                  <TextField
                    label="Item Name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFieldErr((fe) => ({ ...fe, name: "" })); }}
                    fullWidth required error={!!fieldErr.name} helperText={fieldErr.name || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Sort Order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth multiline minRows={2}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Item Status"
                    value={itemStatus}
                    onChange={(e) => setItemStatus(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="out_of_stock">Out of stock</MenuItem>
                    <MenuItem value="unavailable">Unavailable</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center" }}>
                  <FormControlLabel
                    control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                    label="Active"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>Portions & Prices</Typography>
                <Button startIcon={<AddCircleOutlineIcon />} onClick={addPortion}>
                  Add Portion
                </Button>
              </Stack>
              {!!fieldErr.portions && (
                <Typography color="error" mb={1} fontSize={13}>{fieldErr.portions}</Typography>
              )}

              <Stack spacing={1}>
                {portions.map((p, idx) => {
                  const priceNum = Number(p.price || 0);
                  const fp = finalPrice(priceNum, p.discount);
                  return (
                    <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Label"
                            value={p.label}
                            onChange={(e) =>
                              updatePortion(idx, (old) => ({ ...old, label: e.target.value }))
                            }
                            fullWidth
                            error={!!fieldErr[`portion_label_${idx}`]}
                            helperText={fieldErr[`portion_label_${idx}`] || ""}
                            placeholder={allowedLabels?.length ? `e.g., ${allowedLabels[0]}` : "full / normal / 1person"}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Price"
                            type="number"
                            value={p.price}
                            onChange={(e) =>
                              updatePortion(idx, (old) => ({ ...old, price: e.target.value }))
                            }
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start">LKR</InputAdornment> }}
                            error={!!fieldErr[`portion_price_${idx}`]}
                            helperText={fieldErr[`portion_price_${idx}`] || ""}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={!!p.discount?.active}
                                onChange={(e) =>
                                  updatePortion(idx, (old) => ({
                                    ...old,
                                    discount: { ...(old.discount || {}), active: e.target.checked },
                                  }))
                                }
                              />
                            }
                            label="Discount"
                          />
                          {p.discount?.active && (
                            <Stack direction="row" spacing={1}>
                              <Select
                                size="small"
                                value={p.discount?.type || "percent"}
                                onChange={(e) =>
                                  updatePortion(idx, (old) => ({
                                    ...old,
                                    discount: { ...(old.discount || {}), type: e.target.value },
                                  }))
                                }
                                sx={{ minWidth: 110 }}
                              >
                                <MenuItem value="percent">Percent (%)</MenuItem>
                                <MenuItem value="amount">Amount</MenuItem>
                              </Select>
                              <TextField
                                size="small"
                                type="number"
                                label="Value"
                                value={p.discount?.value ?? 0}
                                onChange={(e) =>
                                  updatePortion(idx, (old) => ({
                                    ...old,
                                    discount: { ...(old.discount || {}), value: Number(e.target.value) },
                                  }))
                                }
                                error={!!fieldErr[`portion_disc_${idx}`]}
                                helperText={fieldErr[`portion_disc_${idx}`] || ""}
                                sx={{ maxWidth: 140 }}
                              />
                            </Stack>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2" color="text.secondary">
                            Final: <b>{money(fp)}</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={1} sx={{ textAlign: "right" }}>
                          <Tooltip title="Remove">
                            <span>
                              <IconButton
                                color="error"
                                onClick={() => removePortion(idx)}
                                disabled={portions.length === 1}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })}
              </Stack>

              {!!err && <Typography color="error" mt={2} fontSize={13}>{err}</Typography>}

              <LoadingButton
                loading={loading || idLoading || disabledForm}
                type="submit"
                variant="contained"
                sx={{ mt: 3, py: 1.25 }}
                disabled={disabledForm}
              >
                Create Item
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>

        <Snackbar open={ok} autoHideDuration={1200} onClose={handleSuccessClose}>
          <Alert onClose={handleSuccessClose} severity="success" variant="filled">
            Menu item created
          </Alert>
        </Snackbar>
      </Box>
    </ResponsiveLayout>
  );
}
