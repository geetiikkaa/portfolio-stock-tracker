import { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:8000/api/signup", {
      fullName: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirm,
    });
    console.log(res.data);
    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

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
          Create Account{" "}
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Join us and start your investment journey
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={update("name")}
              placeholder="Enter your name"
              className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60 focus:ring-1 focus:ring-[#7c5cff]/40"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
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
                value={form.password}
                onChange={update("password")}
                placeholder="Create a password"
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

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={update("confirm")}
                placeholder="Confirm your password"
                className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60 focus:ring-1 focus:ring-[#7c5cff]/40"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-300 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="h-3.5 w-3.5 mt-0.5 rounded border-white/20 bg-[#1a1a28] accent-[#7c5cff]"
            />
            <span>
              I agree to the{" "}
              <a href="#" className="text-[#9d7bff] hover:text-[#b39bff]">
                Terms &amp; Conditions
              </a>
            </span>
          </label>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-lg bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#7c5cff]/20 hover:opacity-90 transition"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-[#9d7bff] hover:text-[#b39bff] font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
