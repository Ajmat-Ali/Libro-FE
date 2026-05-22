import { useSelector } from "react-redux";
import { BookOpen, Sun, Moon } from "lucide-react";
import useDarkMode from "../../hooks/useDarkMode";
import Step1LibraryInfo from "./setup/Step1LibraryInfo";
import Step2Floors from "./setup/Step2Floors";
import Step3Seats from "./setup/Step3Seats";
import Step4Slots from "./setup/Step4Slots";
import { Link } from "react-router-dom";

const STEPS = [
  { number: 1, label: "Library" },
  { number: 2, label: "Floors" },
  { number: 3, label: "Seats" },
  { number: 4, label: "Slots" },
];

const OwnerSetup = () => {
  const [isDark, setIsDark] = useDarkMode();
  const currentStep = useSelector((state) => state.wizard.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1LibraryInfo />;
      case 2:
        return <Step2Floors />;
      case 3:
        return <Step3Seats />;
      case 4:
        return <Step4Slots />;
      default:
        return <Step1LibraryInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-['DM_Sans'] transition-colors duration-300 ">
      {/* ---------------------- TOP NAV ------------------------- */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Link to={"/owner/dashboard"}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-slate-900" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              Libro
            </span>
          </div>
        </Link>
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* ------------------------------ STEPPER ------------------------ */}
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-2 ">
        <div className="flex items-center">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className="flex items-center flex-1 last:flex-none"
            >
              {/* Step circle + label */}
              <div className=" flex flex-col items-center gap-1.5">
                <div
                  className={` w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${
                    currentStep === step.number
                      ? "bg-amber-500 text-slate-900 ring-4 ring-amber-500/20"
                      : currentStep > step.number
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {currentStep > step.number ? "✓" : step.number}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block
                  ${
                    currentStep === step.number
                      ? "text-amber-600 dark:text-amber-400"
                      : currentStep > step.number
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line between steps */}
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded transition-all duration-300
                  ${
                    currentStep > step.number
                      ? "bg-emerald-500"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* -------------------- STEP CONTENT --------------------------- */}
      <div className="max-w-2xl mx-auto px-6 py-6 ">{renderStep()}</div>
    </div>
  );
};

export default OwnerSetup;
