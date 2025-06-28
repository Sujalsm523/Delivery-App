import React, { useState, type FC } from "react";
import { useAuth } from "../hooks/Auth";
import { type UserRole } from "../types";
import FadeIn from "../components/common/FadeIn";
import FormCard from "../components/form/FormCard";
import FormInput from "../components/form/FormInput";
import FormTextarea from "../components/form/FormTextarea";
import FormSelect from "../components/form/FormSelect";
import FormButton from "../components/form/FormButton";

interface RegisterPageProps {
  setCurrentPage: (page: string) => void;
}

const RegisterPage: FC<{ onSwitchToLogin: () => void }> = ({
  onSwitchToLogin,
}) => {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("recipient");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password, name, role);
      // Successful signup will be handled by the main App component's effect
    } catch (err: any) {
      setError(err.message || "Failed to register.");
      console.log(err.message);
    }
  };
  // const handleGenerateBio = async () => {
  //   if (!name || !role) {
  //     alert("Please enter your name and select a role first.");
  //     return;
  //   }
  //   setIsGeneratingBio(true);
  //   try {
  //     const generatedBio = await generateBio(name, role);
  //     setBio(generatedBio);
  //   } catch (error) {
  //     console.error("Error generating bio:", error);
  //     alert("Sorry, we couldn't generate a bio right now. Please try again.");
  //   } finally {
  //     setIsGeneratingBio(false);
  //   }
  // };

  // const handleFetchRoles = async () => {
  //   setIsFetchingRoles(true);
  //   setShowRoleModal(true);
  //   try {
  //     const descriptions = await fetchRoleDescriptions();
  //     setRoleDescriptions(descriptions);
  //   } catch (error) {
  //     console.error("Error fetching role descriptions:", error);
  //     setShowRoleModal(false);
  //     alert("Sorry, couldn't fetch role details. Please try again.");
  //   } finally {
  //     setIsFetchingRoles(false);
  //   }
  // };

  return (
    // <div className="flex items-center justify-center min-h-full py-12">
    //   <Card className="max-w-md w-full">
    //     <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
    //       Register for an Account
    //     </h2>
    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <Input
    //         placeholder="Full Name"
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //         required
    //       />
    //       <Input
    //         type="email"
    //         placeholder="Email address"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //       <Input
    //         type="password"
    //         placeholder="Password (min 6 characters)"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //       <div>
    //         <label
    //           htmlFor="role"
    //           className="block text-sm font-medium text-gray-700 mb-1"
    //         >
    //           Registering as a:
    //         </label>
    //         <select
    //           id="role"
    //           value={role}
    //           onChange={(e) => setRole(e.target.value as UserRole)}
    //           className="w-full p-3 rounded-md border border-gray-300"
    //           required
    //         >
    //           <option value="recipient">Recipient</option>
    //           <option value="volunteer">Delivery Volunteer</option>
    //           <option value="storeAssociate">Store Associate</option>
    //         </select>
    //       </div>
    //       {error && <p className="text-red-500 text-sm">{error}</p>}
    //       <Button type="submit" disabled={loading} className="w-full">
    //         {loading ? "Registering..." : "Register"}
    //       </Button>
    //     </form>
    //     <p className="mt-4 text-center text-sm text-gray-600">
    //       Already have an account?{" "}
    //       <button
    //         // onClick={() => setCurrentPage("login")}
    //         className="font-medium text-blue-600 hover:text-blue-500"
    //       >
    //         Login
    //       </button>
    //     </p>
    //   </Card>
    // </div>
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <FadeIn>
        <FormCard>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-slate-400">
              Join the community and start making an impact.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Full Name
              </label>
              <FormInput
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-slate-300"
                >
                  I want to...
                </label>
                <button
                  type="button"
                  // onClick={handleFetchRoles}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
                >
                  {/* {isFetchingRoles ? <Loader /> : "✨ Help me choose"} */}
                </button>
              </div>
              <FormSelect
                id="role"
                name="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="recipient">{`recipient`}</option>
                <option value="volunteer">volunteer</option>
                <option value="storeAssociate">Manage Packages (Store)</option>
              </FormSelect>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-slate-300"
                >
                  Your Bio (Optional)
                </label>
                <button
                  type="button"
                  // onClick={handleGenerateBio}
                  // disabled={isGeneratingBio}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition disabled:opacity-50 flex items-center gap-1"
                >
                  {/* {isGeneratingBio ? <Loader /> : "✨ Auto-generate"} */}
                </button>
              </div>
              <FormTextarea
                id="bio"
                name="bio"
                placeholder="Tell us a bit about yourself..."
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <FormButton type="submit">Create Account</FormButton>
          </form>
          <p className="text-center text-sm text-slate-400 mt-8">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              Sign In
            </button>
          </p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </FormCard>
      </FadeIn>

      {/* {showRoleModal && (
        <Modal onClose={() => setShowRoleModal(false)}>
          <h2 className="text-2xl font-bold text-white mb-4">
            Choose Your Role
          </h2>
          {isFetchingRoles && !roleDescriptions.length ? (
            <div className="flex justify-center items-center h-48">
              <Loader />
            </div>
          ) : (
            <div className="space-y-4">
              {roleDescriptions.map((item, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-cyan-400 capitalize">
                    {item.role}
                  </h3>
                  <p className="text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )} */}
    </div>
  );
};

export default RegisterPage;
