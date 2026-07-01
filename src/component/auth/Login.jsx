import { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    let response = await axios.post("http://localhost:8000/api/login", {
      email,
      password,
    });

    console.log(response.data);
    localStorage.setItem("token", response.data.token);
    navigate("/dashboard");
  };
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full bg-[#0a0a12] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12121d] p-7 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles size={20} className="text-[#9d7bff]" />
          <span className="text-white font-semibold text-lg">Wealthora</span>
        </div>

        {/* Heading */}
        <h1 className="text-white text-2xl font-bold text-center mb-1">
          Welcome Back
          <span role="img" aria-label="wave">
            👋
          </span>
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Login to continue to your account
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60 focus:ring-1 focus:ring-[#7c5cff]/40"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60 focus:ring-1 focus:ring-[#7c5cff]/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-white/20 bg-[#1a1a28] accent-[#7c5cff]"
              />
              Remember me
            </label>
            <a href="#" className="text-[#9d7bff] hover:text-[#b39bff]">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#7c5cff]/20 hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?
          <Link
            to="/registration"
            className="text-[#9d7bff] hover:text-[#b39bff] font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
