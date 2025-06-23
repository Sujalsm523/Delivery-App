// src/components/Layout.tsx
import React, { type ReactNode } from "react";
import { useAuth } from "../hooks/Auth";
import Button from "./Button";

interface LayoutProps {
  children: ReactNode;
  setCurrentPage: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, setCurrentPage }) => {
  const { user, userProfile, loading, signOut } = useAuth();

  return (
    <div
      className="min-h-screen bg-gray-100 font-sans flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <header className="bg-white shadow-sm p-4 flex justify-between items-center fixed top-0 w-full z-10">
        <h1
          className="text-2xl font-bold text-blue-800 cursor-pointer"
          onClick={() => setCurrentPage("home")}
        >
          Sustainable Delivery
        </h1>
        <nav className="flex items-center space-x-4">
          {loading ? (
            <span className="text-gray-600">Loading...</span>
          ) : user && !user.isAnonymous ? (
            <>
              <span className="text-gray-800">
                Hello, {userProfile?.name || user.email} ({userProfile?.role})
              </span>
              <Button onClick={signOut} className="bg-red-500 hover:bg-red-600">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setCurrentPage("login")}>Login</Button>
              <Button onClick={() => setCurrentPage("register")}>
                Register
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-grow pt-20 p-4">{children}</main>
    </div>
  );
};

export default Layout;
