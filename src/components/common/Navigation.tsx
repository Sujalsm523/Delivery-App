// src/components/common/Navigation.tsx
import { navItems } from "../../data/mockData";
import type { TabId } from "../../types";

interface NavigationProps {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  return (
    <nav className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === id
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
