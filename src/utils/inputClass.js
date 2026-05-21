// Reusable input class
export const inputClass = (hasError) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900
     dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400
     outline-none transition-all
     ${
       hasError
         ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
         : "border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
     }`;
