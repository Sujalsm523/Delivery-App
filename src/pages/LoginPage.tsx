import React, { useState, type FC } from "react";
import { useAuth } from "../hooks/Auth";
import FadeIn from "../components/common/FadeIn";
import FormCard from "../components/form/FormCard";
import FormInput from "../components/form/FormInput";
import FormButton from "../components/form/FormButton";

interface LoginPageProps {
  setCurrentPage: (page: string) => void;
}

const LoginPage: FC<LoginPageProps> = ({ setCurrentPage }) => {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      // Successful login is handled by App's useEffect
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <FadeIn>
        <FormCard>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to continue your journey.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email
              </label>
              <FormInput
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <FormInput
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <FormButton type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </FormButton>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <p className="text-center text-sm text-slate-400 mt-8">
            Don't have an account?{" "}
            <button
              onClick={() => setCurrentPage("register")}
              className="font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              Register now
            </button>
          </p>
        </FormCard>
      </FadeIn>
    </div>
  );
};

export default LoginPage;
