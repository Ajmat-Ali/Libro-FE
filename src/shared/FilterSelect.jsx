const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}) => {
  return (
    <div className="flex-1 min-w-[160px]">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3.5 py-2.5 rounded-xl border text-sm
        text-slate-900 dark:text-white
        bg-white dark:bg-slate-800
        border-slate-200 dark:border-slate-700
        focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
        outline-none transition-all
        disabled:opacity-50 disabled:cursor-not-allowed "
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o._id} value={o._id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
