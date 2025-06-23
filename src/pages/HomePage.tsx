import React from "react";
import { useAuth } from "../hooks/Auth";
import Card from "../components/Card";
import Button from "../components/Button";

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { user, userProfile, loading } = useAuth();

  const handleGoToDashboard = () => {
    if (userProfile?.role === "volunteer") setCurrentPage("volunteerDashboard");
    if (userProfile?.role === "recipient") setCurrentPage("recipientDashboard");
    if (userProfile?.role === "storeAssociate")
      setCurrentPage("storeAssociateDashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12">
      <Card className="max-w-2xl w-full text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
          Welcome to Sustainable Last-Mile Delivery
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          A community-driven delivery ecosystem.
        </p>

        {loading ? (
          <p className="text-gray-600">Loading user data...</p>
        ) : user && !user.isAnonymous ? (
          <div className="space-y-4">
            <p className="text-xl font-medium text-blue-700">
              You are logged in as a {userProfile?.role}.
            </p>
            <Button onClick={handleGoToDashboard}>Go to Your Dashboard</Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <Button onClick={() => setCurrentPage("login")}>Login Now</Button>
            <Button
              onClick={() => setCurrentPage("register")}
              className="bg-green-600 hover:bg-green-700"
            >
              Join the Network
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HomePage;
