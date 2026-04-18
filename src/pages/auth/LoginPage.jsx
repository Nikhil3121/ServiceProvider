// src/pages/auth/LoginPage.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "@/services/api";
import useAuthStore from "@/store/authStore";
import { getErrorMessage } from "@/utils";
import { FormField, Input, PasswordInput } from "@/components/ui/FormField";
import Spinner from "@/components/ui/PageLoader";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"; // ✅ ADDED

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const from = location.state?.from?.pathname || "/dashboard";

  const { executeRecaptcha } = useGoogleReCaptcha(); // ✅ ADDED

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    mutate: login,
    isPending,
    error: mutationError,
  } = useMutation({
    mutationFn: async (data) => {
      // ✅ reCAPTCHA check
      if (!executeRecaptcha) {
        throw new Error("reCAPTCHA not ready");
      }

      // ✅ generate token
      const token = await executeRecaptcha("login");

      console.log("LOGIN TOKEN:", token); // ✅ debug

      // ✅ send token + data to backend
      return authApi.login({
        ...data,
        captchaToken: token, // 🔥 IMPORTANT FIX
      });
    },

    onSuccess: ({ data }) => {
      const { user, accessToken, refreshToken } = data.data;
      setAuth({ user, accessToken, refreshToken });
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(from, { replace: true });
    },

    onError: (error) => {
      const msg = getErrorMessage(error);
      if (error.response?.status === 401) {
        setError("password", { message: msg });
      } else {
        toast.error(msg);
      }
    },
  });

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-surface-900">
          Welcome back
        </h1>
        <p className="text-surface-500 mt-2 text-sm">
          Sign in to your Nexus account
        </p>
      </motion.div>

      {mutationError && !errors.password && (
        <motion.div
          variants={itemVariants}
          className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5"
        >
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            {getErrorMessage(mutationError)}
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit((d) => login(d))} className="space-y-4">
        <motion.div variants={itemVariants}>
          <FormField
            label="Email address"
            error={errors.email?.message}
            required
          >
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
              />
              <Input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                error={errors.email?.message}
                className="pl-10"
              />
            </div>
          </FormField>
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField label="Password" error={errors.password?.message} required>
            <PasswordInput
              {...register("password")}
              autoComplete="current-password"
              placeholder="Your password"
              error={errors.password?.message}
            />
          </FormField>
          <div className="mt-1.5 flex justify-end">
            <Link
              to="/auth/forgot-password"
              className="text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary btn-lg w-full mt-2"
          >
            {isPending ? (
              <Spinner size="sm" className="border-white/30 border-t-white" />
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </motion.div>
      </form>

      <motion.p
        variants={itemVariants}
        className="mt-6 text-center text-sm text-surface-500"
      >
        Don't have an account?{" "}
        <Link
          to="/auth/signup"
          className="text-primary-600 hover:text-primary-800 font-medium transition-colors"
        >
          Create one free
        </Link>
      </motion.p>
    </motion.div>
  );
}