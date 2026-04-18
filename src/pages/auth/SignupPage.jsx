// src/pages/auth/SignupPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "@/services/api";
import { getErrorMessage } from "@/utils";
import { FormField, Input, PasswordInput } from "@/components/ui/FormField";
import Spinner from "@/components/ui/PageLoader";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";


const schema = z
.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Enter a valid email address"),
  phone: z
  .string()
  .regex(
    /^\+?[1-9]\d{6,14}$/,
    "Enter a valid phone number with country code",
  ),
  password: z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
})
.refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const PasswordStrength = ({ password = "" }) => {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.ok).length;
  const colors = [
    "bg-surface-200",
    "bg-red-400",
    "bg-amber-400",
    "bg-green-500",
  ];
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : "bg-surface-200"}`}
          />
        ))}
      </div>
      <div className="flex gap-3">
        {checks.map(({ label, ok }) => (
          <span
          key={label}
          className={`text-xs flex items-center gap-1 transition-colors ${ok ? "text-green-600" : "text-surface-400"}`}
          >
            <Check size={10} className={ok ? "opacity-100" : "opacity-0"} />{" "}
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function SignupPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const password = watch("password", "");

  const {
    mutate: signup,
    isPending,
    isSuccess,
    data: signupData,
  } = useMutation({
    mutationFn: async (data) => {
      if (!executeRecaptcha) {
        throw new Error("reCAPTCHA not ready");
      }

      const token = await executeRecaptcha("signup");

      return authApi.signup({
        ...data,
        captchaToken: token, // ✅ correct field + real token
      });
    },
    onSuccess: ({ data }) => {
      toast.success("Account created! Check your email to verify.");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Check size={28} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-surface-900 mb-3">
          Account created!
        </h2>
        <p className="text-surface-500 text-sm mb-2">
          We've sent a verification link to your email address.
        </p>
        <p className="text-surface-500 text-sm mb-8">
          An OTP has also been sent to your phone number to verify it.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() =>
              navigate("/auth/verify-otp", {
                state: { phone: signupData?.data?.data?.phone },
              })
            }
            className="btn-primary w-full justify-center"
          >
            Verify Phone OTP <ArrowRight size={16} />
          </button>
          <Link
            to="/auth/login"
            className="btn-secondary w-full justify-center"
          >
            Go to Login
          </Link>
        </div>
      </motion.div>
    );
  }

  const fields = [
    {
      name: "name",
      label: "Full name",
      icon: User,
      type: "text",
      placeholder: "John Doe",
      comp: Input,
    },
    {
      name: "email",
      label: "Email address",
      icon: Mail,
      type: "email",
      placeholder: "you@company.com",
      comp: Input,
    },
    {
      name: "phone",
      label: "Phone number",
      icon: Phone,
      type: "tel",
      placeholder: "+91 98765 43210",
      comp: Input,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-surface-900">
          Create account
        </h1>
        <p className="text-surface-500 mt-2 text-sm">
          Start your journey with Nexus today
        </p>
      </div>

      <form onSubmit={handleSubmit((d) => signup(d))} className="space-y-4">
        {fields.map(
          ({ name, label, icon: Icon, type, placeholder, comp: Comp }) => (
            <FormField
              key={name}
              label={label}
              error={errors[name]?.message}
              required
            >
              <div className="relative">
                <Icon
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
                />
                <Input
                  {...register(name)}
                  type={type}
                  placeholder={placeholder}
                  error={errors[name]?.message}
                  className="pl-10"
                  autoComplete={name}
                />
              </div>
            </FormField>
          ),
        )}

        <FormField label="Password" error={errors.password?.message} required>
          <PasswordInput
            {...register("password")}
            placeholder="Create a strong password"
            error={errors.password?.message}
          />
          <PasswordStrength password={password} />
        </FormField>

        <FormField
          label="Confirm password"
          error={errors.confirmPassword?.message}
          required
        >
          <PasswordInput
            {...register("confirmPassword")}
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
          />
        </FormField>

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary btn-lg w-full mt-2"
        >
          {isPending ? (
            <Spinner size="sm" className="border-white/30 border-t-white" />
          ) : (
            <>
              <span>Create account</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-surface-400">
        By signing up, you agree to our{" "}
        <Link to="/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="mt-5 text-center text-sm text-surface-500">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-primary-600 hover:text-primary-800 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
