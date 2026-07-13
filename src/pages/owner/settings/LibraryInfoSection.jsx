// src/pages/owner/settings/LibraryInfoSection.jsx
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateLibrary, uploadLogo } from "../../../api/owner.api";
import { setLibrary } from "../../../store/slices/library";

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-colors";

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium ${
        toast.type === "success"
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-500"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      {toast.msg}
    </div>
  );
}

export default function LibraryInfoSection() {
  const dispatch = useDispatch();

  const library = useSelector((s) => s.library ?? null);

  const [form, setForm] = useState({
    name: library?.name ?? "",
    description: library?.description ?? "",
    street: library?.address?.street ?? "",
    city: library?.address?.city ?? "",
    state: library?.address?.state ?? "",
    pincode: library?.address?.pincode ?? "",
    phone: library?.contact?.phone ?? "",
    email: library?.contact?.email ?? "",
    website: library?.contact?.website ?? "",
  });

  const [logoPreview, setLogoPreview] = useState(library?.logo ?? null);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logoSaving, setLogoSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateLibrary({
        name: form.name,
        description: form.description,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        contact: {
          phone: form.phone,
          email: form.email,
          website: form.website,
        },
      });

      dispatch(setLibrary(res?.data?.library));
      showToast("success", "Library info updated successfully");
    } catch (err) {
      showToast("error", err.response?.data?.message ?? "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setLogoSaving(true);
    try {
      const fd = new FormData();
      fd.append("logo", logoFile);
      const res = await uploadLogo(fd);
      setLogoFile(null);
      // dispatch(setLibrary(res.data.library));
      showToast("success", "Logo updated successfully");
    } catch (err) {
      showToast("error", err.response?.data?.message ?? "Logo upload failed");
    } finally {
      setLogoSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
          Library Info
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Basic details visible to members
        </p>
      </div>

      <div className=" flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 overflow-hidden flex items-center justify-center">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-6 h-6 text-slate-300" />
            )}
          </div>
          <button
            onClick={() => {
              fileRef.current?.click();
            }}
            className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden border-5"
            onChange={handleLogoChange}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Library Logo
          </p>
          <p className="text-xs text-slate-400 mt-0.5">JPG or PNG, max 2MB</p>
          {logoFile && (
            <button
              onClick={handleLogoUpload}
              disabled={logoSaving}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {logoSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              {logoSaving ? "Uploading…" : "Upload Logo"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Library Name" required>
            <input
              className={inputCls}
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. City Public Library"
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              value={form.description}
              onChange={set("description")}
              placeholder="Short description of your library…"
            />
          </Field>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Address
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Street" required>
              <input
                className={inputCls}
                value={form.street}
                onChange={set("street")}
                placeholder="Street / Area"
              />
            </Field>
          </div>
          <Field label="City" required>
            <input
              className={inputCls}
              value={form.city}
              onChange={set("city")}
              placeholder="City"
            />
          </Field>
          <Field label="State" required>
            <input
              className={inputCls}
              value={form.state}
              onChange={set("state")}
              placeholder="State"
            />
          </Field>
          <Field label="Pincode" required>
            <input
              className={inputCls}
              value={form.pincode}
              onChange={set("pincode")}
              placeholder="6-digit pincode"
              maxLength={6}
            />
          </Field>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Contact
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone" required>
            <input
              className={inputCls}
              value={form.phone}
              onChange={set("phone")}
              placeholder="+91 98765 43210"
            />
          </Field>
          <Field label="Email" required>
            <input
              className={inputCls}
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="library@email.com"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Website">
              <input
                className={inputCls}
                value={form.website}
                onChange={set("website")}
                placeholder="https://yourlibrary.com (optional)"
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
        <Toast toast={toast} />
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
