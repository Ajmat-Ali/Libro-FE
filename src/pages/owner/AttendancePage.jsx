import { useState } from "react";
import { ClipboardList, UserX, User } from "lucide-react";
import DailyReportTab from "./attendance/DailyReportTab";
import AbsenteesTab from "./attendance/AbsenteesTab";
import StudentAttendanceDrawer from "./attendance/StudentAttendanceDrawer";

const TABS = [
  { id: "daily", label: "Daily report", icon: ClipboardList },
  { id: "absentees", label: "Absentees", icon: UserX },
];

function TabButton({ tab, active, onClick }) {
  const Icon = tab.icon;
  return (
    <button
      onClick={() => onClick(tab.id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-slate-900 dark:bg-slate-700 text-white shadow-sm"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
      }`}
    >
      <Icon className="w-4 h-4" />
      {tab.label}
    </button>
  );
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("daily");

  const [studentDrawer, setStudentDrawer] = useState(null);

  return (
    <div className="font-['DM_Sans'] min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-slate-900 px-4 lg:px-6 pt-6 pb-16">
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl font-bold text-white font-['Playfair_Display']">
            Attendance
          </h1>
        </div>
        <p className="text-slate-400 text-sm">
          Track daily attendance and view member history
        </p>
      </div>

      <div className="px-4 lg:px-6 -mt-10 pb-10 space-y-5">
        <div className=" flex items-center justify-between">
          <div className="flex gap-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-1">
            {TABS.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                active={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </div>
        </div>

        {activeTab === "daily" && (
          <DailyReportTab
            onViewStudent={(studentId, studentName) =>
              setStudentDrawer({ studentId, studentName })
            }
          />
        )}
        {activeTab === "absentees" && <AbsenteesTab />}
      </div>

      {studentDrawer?.studentId && (
        <StudentAttendanceDrawer
          studentId={studentDrawer.studentId}
          studentName={studentDrawer.studentName}
          onClose={() => setStudentDrawer(null)}
        />
      )}
    </div>
  );
}
