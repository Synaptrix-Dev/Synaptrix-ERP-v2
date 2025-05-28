import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/data";
import toast from "react-hot-toast";
import { z } from "zod";
import Logo from "../../assets/logoFull.png";

// Zod schema
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .refine((email) => email.endsWith("@synaptrixsol.com"), {
      message: "Email must be from @synaptrixsol.com domain",
    }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

function SignIn() {
  const { authURL } = useAuth();
  const apiKey = import.meta.env.VITE_APIKEY;
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const formRef = useRef(null); // Ref for the form element

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Autofill email from localStorage (applies to / and /root)
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberEmail");
    console.log(
      `[SignIn] Checking localStorage on route ${location.pathname}:`,
      { rememberedEmail }
    );
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        remember: true,
      }));
    } else {
      console.log("[SignIn] No remembered email found in localStorage");
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data with Zod
    try {
      loginSchema.parse(formData);
      setErrors({});
    } catch (error) {
      const fieldErrors = {};
      error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${authURL}/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        if (formData.remember) {
          localStorage.setItem("rememberEmail", formData.email);
          console.log("[SignIn] Saved email to localStorage:", formData.email);
        } else {
          localStorage.removeItem("rememberEmail");
          console.log("[SignIn] Removed remembered email from localStorage");
        }
        toast.success("Login successful", {
          duration: 3000,
          position: "bottom-right",
        });
        navigate(`/root-erp/overview`);
        console.log("[SignIn] Login successful", data);
      } else {
        toast.error(data.message || "Login failed", {
          duration: 3000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error("Server error. Please try again later.", {
        duration: 3000,
        position: "bottom-right",
      });
      console.error("[SignIn] Server error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter keypress for inputs
  const handleKeyDown = (e) => {
    console.log("[SignIn] Key pressed:", e.key);
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent unwanted default behavior
      console.log("[SignIn] Enter key detected, triggering form submit");
      if (formRef.current) {
        formRef.current.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      } else {
        console.error("[SignIn] Form ref not found");
      }
    }
  };

  // Handle GitHub button click (placeholder for superadmin logic)
  const handleGitHubClick = () => {
    console.log("[SignIn] GitHub button clicked on route", location.pathname);
    // TODO: Add superadmin-specific logic (e.g., different API call or navigation)
    toast.info("GitHub login not implemented yet", {
      duration: 3000,
      position: "bottom-right",
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md mx-auto rounded-xl border border-slate-200 bg-white">
        <div className="p-6">
          <div className="flex flex-col items-start text-center mb-8">
            <img src={Logo} alt="Logo" className="w-48 mb-4" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500">
              Enter your credentials to get into Dashboard
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            autoComplete="on"
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="name@synaptrixsol.com"
                value={formData.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`flex h-10 w-full rounded-md border outline-none px-3 py-2 text-sm ring-offset-white ${
                  errors.email ? "border-red-500" : "border-slate-200"
                }`}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`flex h-10 w-full rounded-md outline-none border px-3 py-2 text-sm ring-offset-white ${
                  errors.password ? "border-red-500" : "border-slate-200"
                }`}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded outline-none border-slate-300 text-slate-900 focus:ring-slate-950"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none"
                >
                  Remember my email
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex h-10 w-full items-center justify-center rounded-md bg-[#314CB6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100"
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 488 512"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.7l-67.5 64.6C314.1 103.6 283.6 96 248 96c-84.2 0-152.6 69-152.6 160s68.4 160 152.6 160c77.9 0 122.5-44.3 128.4-106H248v-85.8h240C488 239 488 250.5 488 261.8z" />
              </svg>
              Google
            </button>

            {/* Placeholder for superadmin-specific action */}
            <button
              type="button"
              onClick={handleGitHubClick}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100"
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.3c-3.2.7-3.8-1.5-3.8-1.5-.5-1.3-1.3-1.6-1.3-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1.8 1.8.8 1.8.5.9 1.5.6 1.9.4.1-.4.4-.6.7-.7-2.5-.3-5.2-1.3-5.2-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.6-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.6 11.6 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.3.8 1 .8 2v3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
