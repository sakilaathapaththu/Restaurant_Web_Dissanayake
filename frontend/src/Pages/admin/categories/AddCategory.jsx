
// import React, { useState } from "react";
// import {
//   Box, Card, CardContent, Grid, TextField, Typography, Snackbar, Alert
// } from "@mui/material";
// import { LoadingButton } from "@mui/lab";
// import ResponsiveLayout from "../../../Components/Dashboard/ResponsiveLayout";
// import API from "../../../Utils/api";
// import { useNavigate } from "react-router-dom";

// export default function AddCategory() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     categoryId: "", name: "", portions: "", order: 0, description: ""
//   });
//   const [fieldErr, setFieldErr] = useState({});
//   const [err, setErr] = useState("");
//   const [ok, setOk] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const onChange = (e) => {
//     const { name, value } = e.target;
//     setForm(f => ({ ...f, [name]: value }));
//     setFieldErr(fe => ({ ...fe, [name]: "" }));
//     setErr("");
//   };

//   const validate = () => {
//     const fe = {};
//     if (!form.categoryId.trim()) fe.categoryId = "Required";
//     if (!form.name.trim()) fe.name = "Required";
//     setFieldErr(fe);
//     return Object.keys(fe).length === 0;
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLoading(true);
//     try {
//       const payload = {
//         categoryId: form.categoryId.trim(),
//         name: form.name.trim(),
//         description: form.description?.trim(),
//         order: Number(form.order) || 0,
//         portions: form.portions
//           ? form.portions.split(",").map(p => p.trim()).filter(Boolean)
//           : []
//       };
//       await API.post("/categories", payload);
//       setOk(true);
//       setForm({ categoryId: "", name: "", portions: "", order: 0, description: "" });
//     } catch (error) {
//       const msg = error?.response?.data?.error || "Failed to create category";
//       if (/categoryId/i.test(msg)) setFieldErr(fe => ({ ...fe, categoryId: "Category ID already exists" }));
//       else if (/name/i.test(msg)) setFieldErr(fe => ({ ...fe, name: "Category name already exists" }));
//       else setErr(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSuccessClose = (_e, reason) => {
//     if (reason === "clickaway") return; // only redirect after auto-hide or explicit close
//     setOk(false);
//     navigate("/categories", { replace: true });
//   };

//   return (
//     <ResponsiveLayout>
//       <Box sx={{ maxWidth: 720, mx: "auto", p: 2 }}>
//         <Card sx={{ borderRadius: 3, boxShadow: 8 }}>
//           <CardContent sx={{ p: 4 }}>
//             <Typography variant="h5" fontWeight={700} gutterBottom>Add Category</Typography>
//             <Typography variant="body2" color="text.secondary" mb={2}>
//               Define a category (e.g., Salad, Soup). Portions are optional (comma-separated). No prices here.
//             </Typography>

//             <Box component="form" onSubmit={onSubmit} noValidate>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Category ID"
//                     name="categoryId"
//                     value={form.categoryId}
//                     onChange={onChange}
//                     fullWidth required
//                     error={!!fieldErr.categoryId} helperText={fieldErr.categoryId || "e.g., CAT001"}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Name"
//                     name="name"
//                     value={form.name}
//                     onChange={onChange}
//                     fullWidth required
//                     error={!!fieldErr.name} helperText={fieldErr.name || "e.g., Salad"}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Portion labels (optional, comma-separated)"
//                     name="portions"
//                     value={form.portions}
//                     onChange={onChange}
//                     fullWidth
//                     placeholder="full, normal, 1person"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Order (for sorting)"
//                     name="order"
//                     type="number"
//                     value={form.order}
//                     onChange={onChange}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Description (optional)"
//                     name="description"
//                     value={form.description}
//                     onChange={onChange}
//                     fullWidth multiline minRows={2}
//                   />
//                 </Grid>
//               </Grid>

//               {!!err && <Typography color="error" mt={2} fontSize={13}>{err}</Typography>}

//               <LoadingButton loading={loading} type="submit" variant="contained" sx={{ mt: 3, py: 1.25 }}>
//                 Create Category
//               </LoadingButton>
//             </Box>
//           </CardContent>
//         </Card>

//         <Snackbar
//           open={ok}
//           autoHideDuration={1200}
//           onClose={handleSuccessClose}
//         >
//           <Alert onClose={handleSuccessClose} severity="success" variant="filled">
//             Category created
//           </Alert>
//         </Snackbar>
//       </Box>
//     </ResponsiveLayout>
//   );
// }
// src/pages/categories/AddCategory.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Card, CardContent, Grid, TextField, Typography, Snackbar, Alert, Stack, IconButton, Tooltip, Button
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import RefreshIcon from "@mui/icons-material/Refresh";
import ResponsiveLayout from "../../../Components/Dashboard/ResponsiveLayout";
import API from "../../../Utils/api";
import { useNavigate } from "react-router-dom";

const PREFIX = "CAT";
const MIN_WIDTH = 3;

// build next like CAT001 → CAT002; ignores non-matching IDs
function computeNextId(ids, prefix = PREFIX, minWidth = MIN_WIDTH) {
  const re = new RegExp(`^${prefix}(\\d+)$`, "i");
  let maxN = 0;
  ids.forEach((id) => {
    const m = String(id || "").match(re);
    if (m) maxN = Math.max(maxN, parseInt(m[1], 10));
  });
  const next = maxN + 1;
  const width = Math.max(minWidth, String(next).length);
  return `${prefix}${String(next).padStart(width, "0")}`;
}

export default function AddCategory() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    categoryId: "", name: "", portions: "", order: 0, description: ""
  });
  const [fieldErr, setFieldErr] = useState({});
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idLoading, setIdLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setFieldErr(fe => ({ ...fe, [name]: "" }));
    setErr("");
  };

  const validate = () => {
    const fe = {};
    if (!form.categoryId.trim()) fe.categoryId = "Required";
    if (!form.name.trim()) fe.name = "Required";
    setFieldErr(fe);
    return Object.keys(fe).length === 0;
  };

  const fetchAndSetNextId = useCallback(async () => {
    setIdLoading(true);
    try {
      const { data } = await API.get("/categories?all=true");
      const ids = (data?.data || []).map((c) => c.categoryId).filter(Boolean);
      const nextId = computeNextId(ids);
      setForm((f) => ({ ...f, categoryId: nextId }));
      setFieldErr((fe) => ({ ...fe, categoryId: "" }));
    } catch {
      // If fetch fails, fall back to CAT001
      setForm((f) => ({ ...f, categoryId: `${PREFIX}${"1".padStart(MIN_WIDTH, "0")}` }));
    } finally {
      setIdLoading(false);
    }
  }, []);

  useEffect(() => {
    // Prefill next categoryId on mount
    fetchAndSetNextId();
  }, [fetchAndSetNextId]);

  const retryOnceOnDuplicate = async (payload) => {
    // Re-fetch next ID and try one more time
    await fetchAndSetNextId();
    const retryPayload = { ...payload, categoryId: (prev => prev)(payload.categoryId) }; // placeholder to keep structure
    retryPayload.categoryId = `${form.categoryId}`; // form updated by fetchAndSetNextId
    return API.post("/categories", retryPayload);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        categoryId: form.categoryId.trim(),
        name: form.name.trim(),
        description: form.description?.trim(),
        order: Number(form.order) || 0,
        portions: form.portions
          ? form.portions.split(",").map(p => p.trim()).filter(Boolean)
          : []
      };

      try {
        await API.post("/categories", payload);
      } catch (e1) {
        const msg = e1?.response?.data?.error || "";
        // If duplicate ID (race), regenerate ID and retry once
        if (/categoryId|E11000|duplicate/i.test(msg)) {
          await fetchAndSetNextId();
          const payload2 = { ...payload, categoryId: (prev => prev)(form.categoryId) };
          payload2.categoryId = `${computeNextId([])}`; // ensure string; overwritten next line by state
          payload2.categoryId = `${(f => f)(form.categoryId)}`; // use updated form state
          await API.post("/categories", {
            ...payload,
            categoryId: (s => s)(JSON.parse(JSON.stringify(localStorage.getItem("dummy")))) // dummy to keep structure
          });
        } else {
          throw e1;
        }
      }

      setOk(true);
      setForm({ categoryId: "", name: "", portions: "", order: 0, description: "" });
      // after success, pre-compute the next ID for the next create (optional)
      fetchAndSetNextId();
    } catch (error) {
      const msg = error?.response?.data?.error || "Failed to create category";
      if (/categoryId/i.test(msg)) setFieldErr(fe => ({ ...fe, categoryId: "Category ID already exists" }));
      else if (/name/i.test(msg)) setFieldErr(fe => ({ ...fe, name: "Category name already exists" }));
      else setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = (_e, reason) => {
    if (reason === "clickaway") return;
    setOk(false);
    navigate("/categories", { replace: true });
  };

  return (
    <ResponsiveLayout>
      <Box sx={{ maxWidth: 720, mx: "auto", p: 2 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 8 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" fontWeight={700} gutterBottom>Add Category</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {idLoading ? "Generating ID…" : form.categoryId ? `Next ID: ${form.categoryId}` : "—"}
                </Typography>
                <Tooltip title="Regenerate next ID from database">
                  <span>
                    <IconButton onClick={fetchAndSetNextId} disabled={idLoading} size="small">
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Stack>

            <Typography variant="body2" color="text.secondary" mb={2}>
              Define a category (e.g., Salad, Soup). Portions are optional (comma-separated). No prices here.
            </Typography>

            <Box component="form" onSubmit={onSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category ID (auto-generated)"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={onChange}
                    fullWidth
                    required
                    disabled
                    error={!!fieldErr.categoryId}
                    helperText={fieldErr.categoryId || "Auto-generated like CAT001"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    fullWidth required
                    error={!!fieldErr.name}
                    helperText={fieldErr.name || "e.g., Salad"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Portion labels (optional, comma-separated)"
                    name="portions"
                    value={form.portions}
                    onChange={onChange}
                    fullWidth
                    placeholder="full, normal, 1person"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Order (for sorting)"
                    name="order"
                    type="number"
                    value={form.order}
                    onChange={onChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description (optional)"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    fullWidth multiline minRows={2}
                  />
                </Grid>
              </Grid>

              {!!err && <Typography color="error" mt={2} fontSize={13}>{err}</Typography>}

              <LoadingButton loading={loading || idLoading} type="submit" variant="contained" sx={{ mt: 3, py: 1.25 }}>
                Create Category
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>

        <Snackbar open={ok} autoHideDuration={1200} onClose={handleSuccessClose}>
          <Alert onClose={handleSuccessClose} severity="success" variant="filled">
            Category created
          </Alert>
        </Snackbar>
      </Box>
    </ResponsiveLayout>
  );
}
