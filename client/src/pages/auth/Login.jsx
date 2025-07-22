import logo from "../../assets/logo.png";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (data.email === "admin@email.com" && data.password === "admin") {
      // Redirect to dashboard or any other route
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <div class="container">
        <div class="left-panel">
          <div class="branding">
            <img src={logo} alt="Finotic Logo" class="logo" />
          </div>
          <div class="info">
            <div class="welcome-message">
              <h2>Customer Management Portal</h2>
              <p>Start managing your account and clients efficiently</p>
            </div>
          </div>
        </div>
        <div class="right-panel">
          <div class="form-container">
            {/* <h2>Account Management</h2> */}
            <p>Login to access your account</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="email"
                placeholder="Enter Username or Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
              <input
                type="password"
                placeholder="Enter Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
              <div class="forgot">
                <a href="#">Forgot password?</a>
              </div>
              <button type="submit" class="login-btn">
                Login
              </button>
              {/* <div class="divider">or</div> */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
