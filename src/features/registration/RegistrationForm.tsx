import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useAuth } from "@/context/auth";

const registrationSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, hyphens, and underscores"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegistrationFormValues = z.infer<typeof registrationSchema>;

// Firebase error code to user-friendly message mapping
const getFirebaseErrorMessage = (
  errorCode: string
): { field?: keyof RegistrationFormValues; message: string } => {
  switch (errorCode) {
    // Authentication errors
    case "auth/email-already-in-use":
      return {
        field: "email",
        message:
          "An account with this email address already exists. Please use a different email or try signing in.",
      };
    case "auth/invalid-email":
      return {
        field: "email",
        message: "Please enter a valid email address.",
      };
    case "auth/weak-password":
      return {
        field: "password",
        message:
          "Password is too weak. Please choose a stronger password with at least 8 characters.",
      };
    case "auth/operation-not-allowed":
      return {
        message:
          "Email/password accounts are not enabled. Please contact support.",
      };
    case "auth/network-request-failed":
      return {
        message:
          "Network error. Please check your internet connection and try again.",
      };
    case "auth/too-many-requests":
      return {
        message: "Too many failed attempts. Please try again later.",
      };
    // Firestore errors
    case "firestore/permission-denied":
      return {
        message:
          "Permission denied. Unable to create user profile. Please contact support.",
      };
    case "firestore/unavailable":
      return {
        message:
          "Database service is temporarily unavailable. Please try again later.",
      };
    case "firestore/deadline-exceeded":
      return {
        message:
          "Request timed out. Please check your connection and try again.",
      };
    default:
      return {
        message: "An unexpected error occurred. Please try again.",
      };
  }
};

export function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");

  const { login } = useAuth();

  const formik = useFormik<RegistrationFormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: toFormikValidationSchema(registrationSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        // Clear any previous errors
        setGeneralError("");

        // Check if email already exists
        const emailQuery = query(
          collection(db, "users"),
          where("email", "==", values.email)
        );
        const emailSnapshot = await getDocs(emailQuery);

        if (!emailSnapshot.empty) {
          setFieldError(
            "email",
            "An account with this email address already exists."
          );
          return;
        }

        // Check if username already exists
        const usernameQuery = query(
          collection(db, "users"),
          where("username", "==", values.username)
        );
        const usernameSnapshot = await getDocs(usernameQuery);

        if (!usernameSnapshot.empty) {
          setFieldError(
            "username",
            "This username is already taken. Please choose a different one."
          );
          return;
        }

        const result = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        await addDoc(collection(db, "users"), {
          uid: result.user.uid,
          email: result.user.email,
          username: values.username,
          createdAt: new Date().toISOString(),
        });

        login({ user: result.user });
      } catch (error) {
        if (error instanceof FirebaseError) {
          const { field, message } = getFirebaseErrorMessage(error.code);

          if (field) {
            // Set field-specific error
            setFieldError(field, message);
          } else {
            // Set general error for non-field-specific errors
            setGeneralError(message);
          }
        } else {
          // Handle non-Firebase errors
          setGeneralError("An unexpected error occurred. Please try again.");
        }

        console.error("Registration error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* General Error Message */}
      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600" role="alert">
            {generalError}
          </p>
        </div>
      )}
      {/* Username Field */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-gray-700">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`transition-colors ${
            formik.touched.username && formik.errors.username
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          placeholder="Choose a username"
          disabled={formik.isSubmitting}
          aria-describedby={
            formik.touched.username && formik.errors.username
              ? "username-error"
              : undefined
          }
        />
        {formik.touched.username && formik.errors.username && (
          <p id="username-error" className="text-sm text-red-600" role="alert">
            {formik.errors.username}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`transition-colors ${
            formik.touched.email && formik.errors.email
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          placeholder="Enter your email address"
          disabled={formik.isSubmitting}
          aria-describedby={
            formik.touched.email && formik.errors.email
              ? "email-error"
              : undefined
          }
        />
        {formik.touched.email && formik.errors.email && (
          <p id="email-error" className="text-sm text-red-600" role="alert">
            {formik.errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`pr-10 transition-colors ${
              formik.touched.password && formik.errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
            placeholder="Create a password"
            disabled={formik.isSubmitting}
            aria-describedby={
              formik.touched.password && formik.errors.password
                ? "password-error"
                : undefined
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={formik.isSubmitting}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p id="password-error" className="text-sm text-red-600" role="alert">
            {formik.errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Confirm password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`pr-10 transition-colors ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
            placeholder="Confirm your password"
            disabled={formik.isSubmitting}
            aria-describedby={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "confirm-password-error"
                : undefined
            }
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            disabled={formik.isSubmitting}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p
            id="confirm-password-error"
            className="text-sm text-red-600"
            role="alert"
          >
            {formik.errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Register Button */}
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white font-medium py-2.5 transition-colors"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Creating account...</span>
          </div>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
