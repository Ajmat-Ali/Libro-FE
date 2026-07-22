import { useRef } from "react";

function OTPInput({ value = "", onChange, disabled = false }) {
  const refs = useRef([]);

  const handleChange = (index, e) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = value.split("");
    arr[index] = digit;
    onChange(arr.join("").slice(0, 6));
    if (digit && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = value.split("");
      if (arr[index]) {
        arr[index] = "";
        onChange(arr.join(""));
      } else if (index > 0) {
        arr[index - 1] = "";
        onChange(arr.join(""));
        refs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) refs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(digits.slice(0, 6));
    refs.current[Math.min(digits.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const filled = !!value[i];

        return (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] ?? ""}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            className={`
              w-11 h-14 sm:w-12 sm:h-[58px] text-center text-2xl font-black 
              rounded-2xl border-2 outline-none transition-all duration-150 
              bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white 
              disabled:opacity-50 disabled:cursor-not-allowed
              max-392:w-9 max-392:h-10
               ${
                 filled
                   ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md shadow-amber-100 dark:shadow-none scale-105"
                   : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 focus:shadow-md focus:shadow-amber-100/50 dark:focus:shadow-none"
               }
            `}
          />
        );
      })}
    </div>
  );
}

export default OTPInput;
