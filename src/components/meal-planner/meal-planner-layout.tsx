import { ReactNode } from "react";
import { MealPlannerHeader } from "./meal-planner-header";

interface MealPlannerLayoutProps {
  children: ReactNode;
}

export function MealPlannerLayout({ children }: MealPlannerLayoutProps) {
  return (
    <div className="fixed inset-0 flex flex-col w-full h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-950">
      <MealPlannerHeader />

      {/* Main Content Area with Dynamic Height */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-purple-300/20 dark:bg-purple-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-[5%] w-72 h-72 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-300/10 dark:bg-blue-600/5 rounded-full filter blur-3xl"></div>
        </div>

        <div className="w-full h-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row p-3 lg:p-5 gap-4 z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
