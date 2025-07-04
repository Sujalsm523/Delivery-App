import React, { type ReactNode } from "react";
import { useAuth } from "../hooks/Auth";
import { CircleUserRound, LogOut, LoaderCircle } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  setCurrentPage: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, setCurrentPage }) => {
  const { user, userProfile, loading, signOut } = useAuth();

  return (
    <div
      className="min-h-screen bg-gray-50 font-sans"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setCurrentPage("home")}
          >
            {/* Walmart Logo Placeholder */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 136 118"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M110.16 88.08L68.22 118L25.84 88.08L0 73.13L25.84 59.25L51.68 73.13V44.38L25.84 30.5L0 15.63L25.84 0L68.22 30.5L110.16 0L136 15.63L110.16 30.5L84.32 44.38V73.13L110.16 59.25L136 73.13L110.16 88.08Z"
                fill="#0071CE"
              />
            </svg>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              Sustainable Delivery
            </h1>
          </div>
          <nav className="flex items-center space-x-4">
            {loading ? (
              <LoaderCircle className="animate-spin text-walmart-blue" />
            ) : user && !user.isAnonymous ? (
              <>
                <div className="text-right hidden md:block">
                  <p className="font-semibold text-gray-800">
                    {userProfile?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userProfile?.role}
                  </p>
                </div>
                <CircleUserRound className="text-gray-600" />
                <button
                  onClick={signOut}
                  className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => setCurrentPage("login")}
                  className="font-semibold text-sm text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => setCurrentPage("register")}
                  className="font-semibold text-sm text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className=" mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
};

export default Layout;
