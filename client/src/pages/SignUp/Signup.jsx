import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import "./Signup.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

const YEAR_OPTIONS = [
  { value: 1, label: "1st Year" },
  { value: 2, label: "2nd Year" },
  { value: 3, label: "3rd Year" },
  { value: 4, label: "4th Year" },
  { value: 5, label: "5th Year" },
];

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    division: "",
    year: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { name, email, division, year, password, confirmPassword } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !division.trim() ||
      !year ||
      !password ||
      !confirmPassword
    ) {
      return "Please fill in all required fields.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    const yearNum = Number(year);
    if (!Number.isInteger(yearNum) || yearNum < 1 || yearNum > 5) {
      return "Please select a valid year.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        division: formData.division.trim(),
        year: Number(formData.year),
        password: formData.password,
      };

      const result = await authService.signup(payload);

      if (result.success) {
        navigate("/login");
      } else {
        setErrorMessage(result.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
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
            <p className="subtitle">Please sign up here</p>
          </div>

          {/* Error Feedback */}
          {errorMessage && <div className="errorAlert">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="form">
            <div className="part-2">
              <div className="inputGroup">
                <div className="inputContainer">
                  <label className="inputLabel">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Robert Allen"
                    value={formData.name}
                    onChange={handleChange}
                    className="inputControl"
                  />
                </div>

                <div className="inputContainer">
                  <label className="inputLabel">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="robertallen@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="inputControl"
                  />
                </div>

                <div className="inputContainer">
                  <label className="inputLabel">Division</label>
                  <input
                    type="text"
                    name="division"
                    required
                    placeholder="e.g. Computer Engineering"
                    value={formData.division}
                    onChange={handleChange}
                    className="inputControl"
                  />
                </div>

                <div className="inputContainer">
                  <label className="inputLabel">Year</label>
                  <select
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleChange}
                    className="inputControl"
                  >
                    <option value="" disabled>
                      Select year
                    </option>
                    {YEAR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inputContainer">
                  <label className="inputLabel">Password</label>
                  <div className="passwordWrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={handleChange}
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

                <div className="inputContainer">
                  <label className="inputLabel">Confirm Password</label>
                  <div className="passwordWrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      placeholder="••••••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="inputControl passwordInput"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="eyeButton"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={24} color="#16151C" />
                      ) : (
                        <FiEye size={24} color="#16151C" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="submitBtn">
              <span className="btn-text">
                {loading ? "Signing up..." : "Sign Up"}
              </span>
            </button>
          </form>
          <p className="loginRedirectText">
            Already have an account?{" "}
            <Link to="/" className="loginLink">
              LogIn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
