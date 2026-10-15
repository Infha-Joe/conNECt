import { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { FiMail, FiCheck, FiAward } from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const FinalYearPrompt = () => {
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();
  // Show if they are in their graduation year or past it, and haven't added a personal email
  const isFinalYear = user?.year && user.year <= currentYear + 1;
  
  if (!isFinalYear || user?.personalEmail || user?.role === "alumni") {
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const { data } = await api.post("/auth/verify-personal-email", { personalEmail: email });
      setUser(data.user);
      setStatus("success");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to link email");
      setStatus("idle");
    }
  };

  const handleGraduate = async () => {
    setStatus("graduating");
    try {
      const { data } = await api.post("/auth/graduate");
      setUser(data.user);
      // Context will redirect them based on their new 'alumni' role automatically!
    } catch (err) {
      setError(err.response?.data?.message || "Failed to graduate");
      setStatus("success");
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 border-0 p-0 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <FiAward size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-display font-bold">Prepare your Alumni Account</h3>
            <p className="mt-1 text-indigo-100 text-sm">
              Your NEC account may become unavailable after graduation. Add and verify a personal email to keep your conNECt account, connectID, and college memories permanently.
            </p>

            {status === "success" ? (
              <div className="mt-5 p-4 bg-white/10 rounded-xl border border-white/20">
                <div className="flex items-center gap-2 text-green-300 font-semibold mb-3">
                  <FiCheck /> Personal email linked successfully!
                </div>
                <p className="text-sm text-indigo-100 mb-4">
                  You can now log in using this email or link your personal Google account. If you have officially graduated, transition your account now to access the Alumni Network.
                </p>
                <Button 
                  onClick={handleGraduate} 
                  variant="secondary" 
                  className="w-full sm:w-auto"
                  disabled={status === "graduating"}
                >
                  {status === "graduating" ? "Transitioning..." : "Graduate to Alumni"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="mt-5 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter personal email (e.g., @gmail.com)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-0 bg-white/10 text-white placeholder:text-indigo-200 outline-none focus:bg-white/20 transition-all text-sm"
                  />
                </div>
                <Button type="submit" variant="primary" disabled={status === "loading"}>
                  {status === "loading" ? "Verifying..." : "Verify & Link"}
                </Button>
              </form>
            )}
            
            {error && <p className="mt-3 text-red-200 text-sm font-medium">{error}</p>}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FinalYearPrompt;
