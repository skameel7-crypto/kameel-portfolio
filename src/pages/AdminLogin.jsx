import {
  useEffect,
  useState
} from "react";

import {
  Navigate,
  useNavigate
} from "react-router-dom";

import {
  LockKeyhole
} from "lucide-react";

import {
  login,
  watchAuth,
  isAdminUser
} from "../services/auth";

export default function AdminLogin() {

  const [
    user,
    setUser
  ] = useState(undefined);

  const [
    email,
    setEmail
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [
    error,
    setError
  ] = useState("");

  const navigate =
    useNavigate();

  useEffect(() => {

    return watchAuth(
      setUser
    );

  }, []);

  if (
    user &&
    isAdminUser(user)
  ) {

    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  const submit = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const result =
        await login(
          email,
          password
        );

      if (
        !isAdminUser(
          result.user
        )
      ) {

        setError(
          "This Firebase user is not the configured admin."
        );

        return;
      }

      navigate(
        "/admin/dashboard"
      );

    } catch (err) {

      setError(
        err.message ||
        "Login failed."
      );

    }
  };

  return (
    <div className="admin-page">

      <div className="admin-login-card">

        <div className="admin-icon">
          <LockKeyhole />
        </div>

        <p className="section-eyebrow">
          KAMEEL PORTFOLIO
        </p>

        <h1>
          Admin Login
        </h1>

        <p>
          Manage your portfolio
          without editing code.
        </p>

        <form onSubmit={submit}>

          <label>
            Email

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

          </label>

          <label>
            Password

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

          </label>

          <button
            className="btn btn-primary"
            type="submit"
          >
            Sign In
          </button>

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

        </form>

        <a href="/">
          ← Back to portfolio
        </a>

      </div>

    </div>
  );
}