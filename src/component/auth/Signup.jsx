import { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { registerSchema } from "../../validation/authValidation";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      location: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/signup`,
        data,
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        response.errors.forEach((err) => {
          setError(err.field, {
            message: err.message,
          });
        });
      } else {
        setError("root", {
          message:
            response?.message || "Something went wrong. Please try again.",
        });
      }
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
          Create Account 🚀
        </h1>

        <p className="text-gray-400 text-sm text-center mb-6">
          Join us and start your investment journey
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Full Name
            </label>

            <input
              type="text"
              {...register("name")}
              placeholder="Enter your name"
              className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60 focus:ring-1 focus:ring-[#7c5cff]/40"
            />

            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

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

            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
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

            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Phone</label>

            <input
              type="tel"
              {...register("phone")}
              placeholder="Enter your Phone no."
              className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60 focus:ring-1 focus:ring-[#7c5cff]/40"
            />

            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Location
            </label>

            <input
              type="text"
              {...register("location")}
              placeholder="Enter your location"
              className="w-full rounded-lg bg-[#1a1a28] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#7c5cff]/60 focus:ring-1 focus:ring-[#7c5cff]/40"
            />

            {errors.location && (
              <p className="text-red-400 text-xs mt-1">
                {errors.location.message}
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
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

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
