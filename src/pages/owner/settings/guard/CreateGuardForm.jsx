import { useState } from "react";
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { createGuard } from "../../../../api/owner.api";

const inputCls =
  "w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 " +
  "dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white " +
  "placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 " +
  "focus:border-amber-400 transition-colors";

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
};

export default function CreateGuardForm({ onSuccess, onError }) {
  const [form, setForm] = useState(EMPTY);
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverValidation, setServerValidation] = useState(EMPTY);

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    // clear field error on change
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  // ── Validate ────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (!form.phone.trim()) e.phone = "Required";
    else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Invalid Phone";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setSaving(true);
    try {
      const res = await createGuard({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        phone: form.phone,
      });

      setForm(EMPTY);
      setErrors({});
      onSuccess?.(res.data.user);
    } catch (err) {
      //   console.log(err.response.data.errors);
      setServerValidation((pre) => ({
        ...pre,
        ...(err?.response?.data?.errors || {}),
      }));

      onError(err.response?.data?.message ?? "Failed to create guard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-amber-500" />
        Create Guard Account
      </p>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            First Name <span className="text-red-400">*</span>
          </label>
          <input
            value={form.firstName}
            onChange={set("firstName")}
            placeholder="First name"
            className={`${inputCls} ${errors.firstName || serverValidation.firstName ? "border-red-400 focus:ring-red-400/30" : ""}`}
          />
          {errors.firstName ||
            (serverValidation.firstName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.firstName || serverValidation.firstName}
              </p>
            ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Last Name
          </label>
          <input
            value={form.lastName}
            onChange={set("lastName")}
            placeholder="Last name (optional)"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="guard@library.com"
            className={`${inputCls} ${errors.email || serverValidation.email ? "border-red-400 focus:ring-red-400/30" : ""}`}
          />
          {(errors.email || serverValidation.email) && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email || serverValidation.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Phone <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.phone}
            onChange={set("phone")}
            placeholder="9876543210"
            className={`${inputCls} ${errors.phone || serverValidation.phone ? "border-red-400 focus:ring-red-400/30" : ""}`}
          />
          {errors.phone ||
            (serverValidation.phone && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phone || serverValidation.phone}
              </p>
            ))}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              placeholder="Min 8 characters"
              className={`${inputCls} pr-10 ${errors.password || serverValidation.password ? "border-red-400 focus:ring-red-400/30" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPass ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password ||
            (serverValidation.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password || serverValidation.password}
              </p>
            ))}

          <p className="text-xs text-slate-400 mt-1.5">
            Share these credentials with your guard. They'll use email +
            password to log in.
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating…
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Create Guard
            </>
          )}
        </button>
      </div>
    </div>
  );
}
