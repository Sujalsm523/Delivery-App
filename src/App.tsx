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


type page =
  | "landing"
  | "login"
  | "register"
  | "recipientDashboard"
  | "volunteerDashboard"
  | "storeAssociateDashboard";

function App() {
  // Start the user on the landing page
  const [currentPage, setCurrentPage] = useState<page>("landing");
  const { user, userProfile, loading } = useAuth();

  // This powerful hook handles all automatic redirection
  useEffect(() => {
    // Don't do anything until Firebase has confirmed the auth state
    if (loading) {
      return;
    }

    // CASE 1: User is logged in and has a profile
    if (user && !user.isAnonymous && userProfile) {
      console.log(
        `User logged in. Role: ${userProfile.role}. Redirecting to dashboard.`
      );
      // Redirect to the correct dashboard based on their role
      if (userProfile.role === "recipient") {
        setCurrentPage("recipientDashboard");
      } else if (userProfile.role === "volunteer") {
        setCurrentPage("volunteerDashboard");
      } else if (userProfile.role === "storeAssociate") {
        setCurrentPage("storeAssociateDashboard");
      }
    }
    // CASE 2: User is logged out OR is a guest
    else {
      // If the user is currently on an authenticated page (like a dashboard) and they log out,
      // this will redirect them back to the landing page.
      if (
        currentPage !== "login" &&
        currentPage !== "register" &&
        currentPage !== "landing"
      ) {
        console.log(
          "User logged out or has no profile. Redirecting to landing page."
        );
        setCurrentPage("landing");
      }
    }
  }, [user, userProfile, loading, currentPage]);

  const renderPage = () => {
    // The landing, login, and register pages have their own full-screen layout
    if (currentPage === "landing") {
      // Pass setCurrentPage so the landing page can navigate to login/register
      return <HomePage setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === "login") {
      return <LoginPage setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === "register") {
      return <RegisterPage setCurrentPage={setCurrentPage} />;
    }

    // All other pages are "inside" the main app layout with the header
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
        // Fallback for any unexpected state
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
