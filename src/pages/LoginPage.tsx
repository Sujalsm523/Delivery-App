import React, { useState } from "react";
import { useAuth } from "../hooks/Auth";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

interface LoginPageProps {
  setCurrentPage: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage }) => {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      // Successful login will be handled by the main App component's effect
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full py-12">
      <Card className="max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Log In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging In..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => setCurrentPage("register")}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register
          </button>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
