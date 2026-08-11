import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrorMessage(result.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="pageContainer">
      <div className="halfBg" />
      <div className="card">
        {/* Logo Section */}
        <div className="logoContainer">
          <h1>
            <span className="logoText">Logoipsum</span>
          </h1>
        </div>

        <div className="inside-cont">
          <div className="part-1">
            <h1 className="title">
              Welcome <span className="handEmoji">👋</span>
            </h1>
            <p className="subtitle">Please login here</p>
          </div>
          {/* Error Feedback */}
          {errorMessage && <div className="errorAlert">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="form">
            <div className="part-2">
              <div className="inputGroup">
                <div className="inputContainer">
                  <label className="inputLabel">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="robertallen@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="inputControl"
                  />
                </div>

                <div className="inputContainer">
                  <label className="inputLabel">Password</label>
                  <div className="passwordWrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="inputControl passwordInput"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="eyeButton"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <FiEyeOff size={24} color="#16151C" />
                      ) : (
                        <FiEye size={24} color="#16151C" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
          
              <div className="rememberRow">
                <label className="checkboxLabel">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox"
                  />
                  <span className="rememberText">Remember Me</span>
                </label>
              </div>
            </div>
            {/* Submit Button */}
            <button type="submit" disabled={loading} className="submitBtn">
              <span className="btn-text">{loading ? "Logging in..." : "Login"}</span>
            </button>
          </form>
          <p className="loginRedirectText">
            Already have an account?{" "}
            <Link to="/signup" className="loginLink">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
