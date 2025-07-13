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


type Page =
  | "landing"
  | "login"
  | "register"
  | "recipientDashboard"
  | "volunteerDashboard"
  | "storeAssociateDashboard";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const { user, userProfile, loading } = useAuth();

  // Automatically redirect based on login status and role
  useEffect(() => {
    if (loading) return;

    // If user is logged in and profile is loaded
    if (user && !user.isAnonymous && userProfile) {
      console.log(`User logged in. Role: ${userProfile.role}. Redirecting to dashboard.`);
      switch (userProfile.role) {
        case "recipient":
          setCurrentPage("recipientDashboard");
          break;
        case "volunteer":
          setCurrentPage("volunteerDashboard");
          break;
        case "storeAssociate":
          setCurrentPage("storeAssociateDashboard");
          break;
        default:
          setCurrentPage("landing");
      }
    } else {
      // User is logged out or a guest, ensure safe redirect
      if (
        currentPage !== "login" &&
        currentPage !== "register" &&
        currentPage !== "landing"
      ) {
        console.log("User logged out or has no profile. Redirecting to landing page.");
        setCurrentPage("landing");
      }
    }
  }, [user, userProfile, loading]);

  // Render current page
  const renderPage = () => {
    // Landing, Login, and Register are full-screen
    if (currentPage === "landing") return <HomePage setCurrentPage={setCurrentPage} />;
    if (currentPage === "login") return <LoginPage setCurrentPage={setCurrentPage} />;
    if (currentPage === "register") return <RegisterPage setCurrentPage={setCurrentPage} />;

    // Dashboard pages inside main Layout
    let dashboardContent;
    switch (currentPage) {
      case "recipientDashboard":
        dashboardContent = <RecipientDashboard />;
        break;
      case "volunteerDashboard":
        dashboardContent = <VolunteerDashboard />;
        break;
      case "storeAssociateDashboard":
        dashboardContent = <StoreAssociateDashboard />;
        break;
      default:
        dashboardContent = <div>Page not found</div>;
    }

    return (
      <Layout setCurrentPage={setCurrentPage}>
        {loading ? <Card>Loading...</Card> : dashboardContent}
      </Layout>
    );
  };

  return <>{renderPage()}</>;
}

export default App;
