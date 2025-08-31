
import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Grid, TextField, Typography, MenuItem, Switch, FormControlLabel,
  Stack, IconButton, Tooltip, Snackbar, Alert, Button
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useNavigate, useParams } from "react-router-dom";
import ResponsiveLayout from "../../../Components/Dashboard/ResponsiveLayout";
import API from "../../../Utils/api";

const STATUS = [
  { value: "available", label: "Available" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "unavailable", label: "Unavailable" },
];

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const API_ORIGIN = (API?.defaults?.baseURL || "").replace(/\/api\/?$/, "");

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [okOpen, setOkOpen] = useState(false);

  const [item, setItem] = useState({
    name: "", menuId: "", categoryId: "", categoryName: "",
    order: 0, itemStatus: "available", isActive: true, isPopular: false,
    portions: []
  });

  const [categories, setCategories] = useState([]);

  const [imagePreview, setImagePreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageSize, setImageSize] = useState(0);
  const [removeImage, setRemoveImage] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: itemRes }, { data: catRes }] = await Promise.all([
        API.get(`/menu-items/${id}?withImage=true`),
        API.get(`/categories?all=true`),
      ]);
      const doc = itemRes?.data || {};
      setItem({
        name: doc.name || "",
        menuId: doc.menuId || "",
        categoryId: doc.categoryId || "",
        order: doc.order ?? 0,
        itemStatus: doc.itemStatus || "available",
        isActive: !!doc.isActive,
        isPopular: !!doc.isPopular,
        portions: (doc.portions || []).map(p => ({
          label: p.label || "",
          price: p.price ?? 0,
          finalPrice: p.finalPrice ?? p.price ?? 0,
        })),
      });
      setCategories(catRes?.data || []);

      if (doc.imageDataUri) setImagePreview(doc.imageDataUri);
      else if (doc.hasImage) setImagePreview(`${API_ORIGIN}/api/menu-items/${doc.menuId || id}/image`);
      else setImagePreview("");

      setImageBase64("");
      setImageName("");
      setImageSize(0);
      setRemoveImage(false);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [id]);

  const updatePortion = (idx, key, value) => {
    setItem((it) => {
      const next = [...it.portions];
      next[idx] = { ...next[idx], [key]: key.includes("price") ? Number(value) : value };
      return { ...it, portions: next };
    });
  };

  const addPortion = () => setItem((it) => ({ ...it, portions: [...(it.portions || []), { label: "", price: 0, finalPrice: 0 }] }));
  const removePortion = (idx) => setItem((it) => ({ ...it, portions: it.portions.filter((_, i) => i !== idx) }));

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_MIME.includes(file.type)) { setErr("Only JPEG, PNG, or WEBP images are allowed"); return; }
    if (file.size > MAX_IMAGE_BYTES) { setErr("Image too large (max ~1.5MB)"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = String(reader.result || "");
      setImagePreview(dataUri);
      setImageBase64(dataUri);
      setImageName(file.name);
      setImageSize(file.size);
      setRemoveImage(false);
    };
    reader.readAsDataURL(file);
  };

  const clearImageSelection = () => {
    setImageBase64("");
    setImageName("");
    setImageSize(0);
  };

  const markRemoveImage = () => {
    setRemoveImage(true);
    setImageBase64("");
    setImagePreview("");
    setImageName("");
    setImageSize(0);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      const payload = {
        name: item.name.trim(),
        categoryId: item.categoryId,
        order: Number(item.order) || 0,
        itemStatus: item.itemStatus,
        isActive: !!item.isActive,
        isPopular: !!item.isPopular,
        portions: (item.portions || [])
          .filter(p => p.label?.trim())
          .map(p => ({ label: p.label.trim(), price: Number(p.price) || 0, finalPrice: Number(p.finalPrice) || Number(p.price) || 0 })),
        ...(removeImage ? { removeImage: true } : {}),
        ...(!removeImage && imageBase64 ? { imageBase64 } : {}),
      };
      await API.patch(`/menu-items/${id}`, payload);
      setOkOpen(true);
      // We’ll navigate after the success Snackbar closes.
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Navigate to list when success toast closes
  const handleSuccessClose = (_e, reason) => {
    if (reason === "clickaway") return;
    setOkOpen(false);
    navigate("/items", { replace: true });
  };

  return (
    <ResponsiveLayout>
      <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 8 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Edit Item</Typography>
            {loading ? (
              <Typography>Loading…</Typography>
            ) : (
              <Box component="form" onSubmit={onSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      label="Name" name="name" value={item.name} onChange={(e) => setItem(i => ({ ...i, name: e.target.value }))}
                      fullWidth required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Menu ID" name="menuId" value={item.menuId} fullWidth disabled
                      helperText="Auto-generated or immutable"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select label="Category" name="categoryId" value={item.categoryId}
                      onChange={(e) => setItem(i => ({ ...i, categoryId: e.target.value }))}
                      fullWidth required
                    >
                      {categories.map((c) => (
                        <MenuItem key={c._id} value={c.categoryId}>{c.name} ({c.categoryId})</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Order" name="order" type="number" value={item.order}
                      onChange={(e) => setItem(i => ({ ...i, order: e.target.value }))} fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      select label="Status" name="itemStatus" value={item.itemStatus}
                      onChange={(e) => setItem(i => ({ ...i, itemStatus: e.target.value }))} fullWidth
                    >
                      {STATUS.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={<Switch checked={item.isActive} onChange={(e) => setItem(i => ({ ...i, isActive: e.target.checked }))} />}
                      label="Active"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={<Switch checked={item.isPopular} onChange={(e) => setItem(i => ({ ...i, isPopular: e.target.checked }))} />}
                      label="Popular Item"
                    />
                  </Grid>

                  {/* Image editor */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Image</Typography>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                      <Button component="label" startIcon={<PhotoCameraIcon />} variant="outlined">
                        Choose Image
                        <input
                          type="file"
                          hidden
                          accept={ALLOWED_MIME.join(",")}
                          onChange={onImageChange}
                        />
                      </Button>

                      {imageName && (
                        <Typography variant="body2" color="text.secondary">
                          {imageName} {imageSize ? `• ${(imageSize / 1024).toFixed(0)} KB` : ""}
                        </Typography>
                      )}

                      {imageBase64 && (
                        <Tooltip title="Clear selected image (keep current)">
                          <span>
                            <IconButton color="warning" onClick={clearImageSelection}>
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}

                      {imagePreview && (
                        <Tooltip title="Remove image from item">
                          <span>
                            <IconButton color="error" onClick={markRemoveImage}>
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </Stack>

                    {imagePreview ? (
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="preview"
                        sx={{ width: 240, height: 180, objectFit: "cover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}
                        onError={() => setImagePreview("")}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {removeImage ? "Image will be removed." : "No image. You can upload JPEG/PNG/WEBP (max ~1.5MB)."}
                      </Typography>
                    )}
                  </Grid>

                  {/* Portions editor */}
                  <Grid item xs={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700}>Portions</Typography>
                      <IconButton onClick={addPortion} color="primary"><AddIcon /></IconButton>
                    </Stack>
                    <Grid container spacing={1}>
                      {(item.portions || []).map((p, idx) => (
                        <React.Fragment key={idx}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Label" value={p.label} onChange={(e) => updatePortion(idx, "label", e.target.value)}
                              fullWidth placeholder="full / half / 1person"
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Base Price" type="number" value={p.price}
                              onChange={(e) => updatePortion(idx, "price", e.target.value)} fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Final Price" type="number" value={p.finalPrice}
                              onChange={(e) => updatePortion(idx, "finalPrice", e.target.value)} fullWidth
                              helperText="If discounts applied"
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Tooltip title="Remove">
                              <IconButton color="error" onClick={() => removePortion(idx)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </React.Fragment>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>

                {!!err && <Typography color="error" mt={2} fontSize={13}>{err}</Typography>}

                <LoadingButton loading={saving} type="submit" variant="contained" sx={{ mt: 3, py: 1.25 }}>
                  Save Changes
                </LoadingButton>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* 🔁 Navigate to list when this closes */}
        <Snackbar open={okOpen} autoHideDuration={1200} onClose={handleSuccessClose}>
          <Alert onClose={handleSuccessClose} severity="success" variant="filled">Item saved</Alert>
        </Snackbar>
      </Box>
    </ResponsiveLayout>
  );
}
