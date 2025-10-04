import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../redux/api/apiSlice";
import { homeForRole } from "../../utils/roles";
import logo from "../../assets/logo.png";

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const [showPw, setShowPw] = useState(false);

  const navigate = useNavigate();
  const from = useLocation().state?.from?.pathname || "/dashboard";

  const onSubmit = async (values) => {
    try {
      const user = await login({
        email: values.email.trim(),
        password: values.password,
      }).unwrap();
      const dest = from || homeForRole(user.role_id);
      navigate(dest, { replace: true });
    } catch (e) {
      setError("root", {
        type: "server",
        message: e?.data?.message || "Invalid email or password",
      });
    }
  };

  const disabled = isSubmitting || isLoading;

  return (
    <>
      <div class="container">
        <div class="left-panel">
          <div class="branding">
            <img src={logo} alt="Finotic Logo" class="logo" />
          </div>
          <div class="info">
            <div class="welcome-message">
              <h2>User Management Portal</h2>
              <p>Manage your account and clients efficiently</p>
            </div>
          </div>
        </div>
        <div class="right-panel">
          <div class="form-container">
            {/* <h2>Account Management</h2> */}
            <p>Login to access your account</p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <input
                type="email"
                autoComplete="email"
                style={{ width: "100%", padding: 8, marginTop: 6 }}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p style={{ color: "crimson", marginTop: 6 }}>
                  {errors.email.message}
                </p>
              )}

              <div>
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  style={{ flex: 1, padding: 8, width: "80%" }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  style={{ padding: "8px 10px" }}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p style={{ color: "crimson", marginTop: 6 }}>
                  {errors.password.message}
                </p>
              )}
              <div class="forgot">
                <a href="#">Forgot password?</a>
              </div>
              {errors.root?.message && (
                <div style={{ color: "crimson", marginTop: 10 }}>
                  {errors.root.message}
                </div>
              )}
              <button type="submit" disabled={disabled} class="login-btn">
                Login
              </button>
              {/* <div class="divider">or</div> */}
            </form>
          </div>
        </div>
      </div>

      {/* ............... */}
      {/* <div
        style={{
          maxWidth: 420,
          margin: "64px auto",
          padding: 24,
          border: "1px solid #eee",
          borderRadius: 8,
        }}
      >
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label style={{ display: "block", marginTop: 12 }}>
            Email
            <input
              type="email"
              autoComplete="email"
              style={{ width: "100%", padding: 8, marginTop: 6 }}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <div style={{ color: "crimson", marginTop: 6 }}>
                {errors.email.message}
              </div>
            )}
          </label>

          <label style={{ display: "block", marginTop: 12 }}>
            Password
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <input
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                style={{ flex: 1, padding: 8 }}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                style={{ padding: "8px 10px" }}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <div style={{ color: "crimson", marginTop: 6 }}>
                {errors.password.message}
              </div>
            )}
          </label>

          {errors.root?.message && (
            <div style={{ color: "crimson", marginTop: 10 }}>
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={disabled}
            style={{ marginTop: 16, padding: "10px 16px" }}
          >
            {disabled ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div> */}
    </>
  );
}
