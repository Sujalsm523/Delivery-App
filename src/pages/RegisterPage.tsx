import React, { useState } from "react";
import { useAuth } from "../hooks/Auth";
import { type UserRole } from "../types";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

interface RegisterPageProps {
  setCurrentPage: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentPage }) => {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("recipient");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password, name, role);
      // Successful signup will be handled by the main App component's effect
    } catch (err: any) {
      setError(err.message || "Failed to register.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full py-12">
      <Card className="max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Register for an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Registering as a:
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full p-3 rounded-md border border-gray-300"
              required
            >
              <option value="recipient">Recipient</option>
              <option value="volunteer">Delivery Volunteer</option>
              <option value="storeAssociate">Store Associate</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => setCurrentPage("login")}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login
          </button>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
