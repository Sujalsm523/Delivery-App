// src/App.tsx
import { useState, useEffect } from "react";
import { useAuth } from "./hooks/Auth";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecipientDashboard from "./pages/RecipientDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import StoreAssociateDashboard from "./pages/StoreAssociateDashboard";
import Card from "./components/Card";
import { seedDatabase } from "./services/seedData";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const { user, userProfile, loading } = useAuth();

  // This effect handles navigation after login/logout
  useEffect(() => {
    if (!loading && user && !user.isAnonymous && userProfile) {
      // User is logged in, navigate them to their dashboard
      if (userProfile.role === "recipient") {
        setCurrentPage("recipientDashboard");
      } else if (userProfile.role === "volunteer") {
        setCurrentPage("volunteerDashboard");
      } else if (userProfile.role === "storeAssociate") {
        setCurrentPage("storeAssociateDashboard");
      }
    } else if (!loading && (!user || user.isAnonymous)) {
      // User is not logged in or is anonymous, stay on auth pages or go home
      if (currentPage !== "login" && currentPage !== "register") {
        setCurrentPage("home");
      }
    }
  }, [user, userProfile, loading, currentPage]);

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <Card>Loading Application...</Card>
        </div>
      );
    }

    switch (currentPage) {
      case "login":
        return (
          <LoginPage onSwitchToRegister={() => setCurrentPage("register")} />
        );
      case "register":
        return <RegisterPage onSwitchToLogin={() => setCurrentPage("login")} />;
      case "recipientDashboard":
        return userProfile?.role === "recipient" ? (
          <RecipientDashboard />
        ) : (
          <HomePage setCurrentPage={setCurrentPage} />
        );
      case "volunteerDashboard":
        return userProfile?.role === "volunteer" ? (
          <VolunteerDashboard />
        ) : (
          <HomePage setCurrentPage={setCurrentPage} />
        );
      case "storeAssociateDashboard":
        return userProfile?.role === "storeAssociate" ? (
          <StoreAssociateDashboard />
        ) : (
          <HomePage setCurrentPage={setCurrentPage} />
        );
      case "home":
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <Layout setCurrentPage={setCurrentPage}>
      {/* --- Add this temporary button for development --- */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={seedDatabase}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg font-semibold hover:bg-yellow-500"
          >
            Seed Database
          </button>
        </div>
      )}
      {/* ------------------------------------------- */}
      {renderPage()}
    </Layout>
  );
}

export default App;
