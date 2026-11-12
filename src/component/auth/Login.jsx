import { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { setUser } from "../../features/auth/authSlice";
import { loginSchema } from "../../validation/authValidation";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        data,
      );

      const token = response.data.token;

      localStorage.setItem("token", token);

      const me = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setUser(me.data));
      navigate("/dashboard");
    } catch (error) {
      setError("root", {
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a12] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12121d] p-7 shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles size={20} className="text-[#9d7bff]" />
          <span className="text-white font-semibold text-lg">Wealthora</span>
        </div>

        <h1 className="text-white text-2xl font-bold text-center mb-1">
          Welcome Back 👋
        </h1>

        <p className="text-gray-400 text-sm text-center mb-6">
          Login to continue to your account
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Email Address
            </label>

            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60 focus:ring-1 focus:ring-[#7c5cff]/40"
            />

            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
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

            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-red-400 text-sm text-center">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg mt-6 bg-gradient-to-r from-[#5b6cff] to-[#b14ef5] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#7c5cff]/20 hover:opacity-90 transition disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
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
