import "./App.css";
import logo from "./assets/logo.png";

function App() {
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
              <p>Start managing your clients faster and much better</p>
            </div>
          </div>
        </div>
        <div class="right-panel">
          <div class="form-container">
            {/* <h2>Account Management</h2> */}
            <p>Login to access your account</p>
            <form>
              <input type="email" placeholder="you@example.com" required />
              <input
                type="password"
                placeholder="At least 8 characters"
                required
              />
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
}

export default App;
