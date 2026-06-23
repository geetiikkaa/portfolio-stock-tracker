import { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91A8.78 8.78 0 0 0 17.64 9.2z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.85.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.97 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.33z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor">
    <path d="M13.27 9.55c.02 1.84.94 2.94 2.73 3.55-.4 1.22-1.04 2.4-1.93 3.55-.86 1.13-1.78 1.84-2.76 1.84-.96 0-1.42-.55-2.65-.55-1.27 0-1.78.55-2.69.55-.96 0-1.93-.74-2.83-1.97C1.5 14.77.86 12.95.84 11.13c-.03-1.97.56-3.6 1.65-4.66.83-.82 1.85-1.31 2.97-1.33 1.03-.02 1.96.66 2.6.66.61 0 1.74-.81 2.95-.69.5.04 1.95.21 2.99 1.64-.08.05-1.78 1.05-1.73 2.8zM10.36 3.1c.5-.6.85-1.45.76-2.3-.74.03-1.63.49-2.16 1.09-.48.53-.9 1.39-.79 2.21.81.06 1.66-.41 2.19-1z" />
  </svg>
);

export default function Login() {
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
          Welcome Back <span role="img" aria-label="wave">👋</span>
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Login to continue to your account
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-500">or continue with</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#1a1a28] py-2.5 text-sm text-gray-200 hover:bg-[#20202f] transition">
            <GoogleIcon />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#1a1a28] py-2.5 text-sm text-gray-200 hover:bg-[#20202f] transition">
            <AppleIcon />
            Apple
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-[#9d7bff] hover:text-[#b39bff] font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
