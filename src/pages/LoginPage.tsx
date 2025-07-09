import React, { useState, type FC } from "react";
import { useAuth } from "../hooks/Auth";
import FadeIn from "../components/common/FadeIn";
import FormCard from "../components/form/FormCard";
import FormInput from "../components/form/FormInput";
import FormButton from "../components/form/FormButton";


const LoginPage: FC<{ onSwitchToRegister: () => void }> = ({
  onSwitchToRegister,
}) => {
  const { signIn } = useAuth();
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
      console.log(err.message);
    }
  };
  return (
    //   <div className="flex items-center justify-center min-h-full py-12">
    //     <Card className="max-w-md w-full">
    //       <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
    //         Log In
    //       </h2>
    //       <form onSubmit={handleSubmit} className="space-y-4">
    //         <Input
    //           type="email"
    //           placeholder="Email address"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           required
    //         />
    //         <Input
    //           type="password"
    //           placeholder="Password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           required
    //         />
    //         {error && <p className="text-red-500 text-sm">{error}</p>}
    //         <Button type="submit" disabled={loading} className="w-full">
    //           {loading ? "Logging In..." : "Login"}
    //         </Button>
    //       </form>
    //       <p className="mt-4 text-center text-sm text-gray-600">
    //         Don't have an account?{" "}
    //         <button
    //           onClick={() => setCurrentPage("register")}
    //           className="font-medium text-blue-600 hover:text-blue-500"
    //         >
    //           Register
    //         </button>
    //       </p>
    //     </Card>
    //   </div>
    // );
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
            <FormButton type="submit">Sign In</FormButton>
          </form>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <p className="text-center text-sm text-slate-400 mt-8">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
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