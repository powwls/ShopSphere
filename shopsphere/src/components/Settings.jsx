import { useEffect, useState } from "react";
import {
  KeyRound,
  Bell,
  ShieldCheck,
  ChevronRight,
  Lock,
  Mail,
  Smartphone,
  Check,
} from "lucide-react";

function Settings({ currentUser }) {
  const [activeSection, setActiveSection] =
    useState(null);

  const [notifications, setNotifications] =
    useState({
      orderUpdates: true,
      promotions: true,
      wishlistUpdates: true,
    });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [security, setSecurity] = useState({
    emailVerified: false,
    twoFactorEnabled: false,
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");

  useEffect(() => {
    if (!currentUser || activeSection !== "security") return;

    fetch(`http://localhost:5000/api/auth/security/${currentUser.id}`)
      .then((response) => response.json())
      .then((data) => setSecurity(data))
      .catch(() => setMessage("Unable to load security status."));
  }, [activeSection, currentUser]);

  function openSection(section) {
    setActiveSection(section);
    setMessage("");
  }

  function goBack() {
    setActiveSection(null);
    setMessage("");
  }

  function handleNotificationChange(name) {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

async function handleChangePassword(e) {
  e.preventDefault();

  if (
    !passwords.currentPassword ||
    !passwords.newPassword ||
    !passwords.confirmPassword
  ) {
    setMessage("Please fill in all password fields.");
    return;
  }

  if (passwords.newPassword !== passwords.confirmPassword) {
    setMessage("New passwords do not match.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    setMessage(data.message);

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error) {
    setMessage(error.message || "Unable to change password.");
  }
}

  async function requestEmailVerification() {
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/email-verification/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage(data.message);
      setVerificationCode(data.code || "");
    } catch (error) {
      setMessage(error.message || "Unable to create verification code.");
    }
  }

  async function verifyEmail(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/email-verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, code: enteredCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSecurity((previous) => ({ ...previous, emailVerified: true }));
      setVerificationCode("");
      setEnteredCode("");
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message || "Unable to verify email.");
    }
  }

  async function toggleTwoFactor() {
    const enabled = !security.twoFactorEnabled;
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/security/2fa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, enabled }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSecurity((previous) => ({ ...previous, twoFactorEnabled: enabled }));
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message || "Unable to update two-factor authentication.");
    }
  }

  /* CHANGE PASSWORD */

  if (activeSection === "password") {
    return (
      <section className="settings-page">
        <div className="settings-container">

          <button
            type="button"
            className="settings-back-button"
            onClick={goBack}
          >
            ← Back to Settings
          </button>

          <div className="settings-header">
            <p className="section-subtitle">
              ACCOUNT SECURITY
            </p>

            <h1>Change Password</h1>

            <p>
              Update your account password.
            </p>
          </div>

          <div className="settings-card settings-form-card">

            <div className="settings-form-icon">
              <KeyRound size={28} />
            </div>

            <form
              className="settings-form"
              onSubmit={handleChangePassword}
            >

              <label>
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                value={
                  passwords.currentPassword
                }
                onChange={
                  handlePasswordChange
                }
              />

              <label>
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={
                  passwords.newPassword
                }
                onChange={
                  handlePasswordChange
                }
              />

              <label>
                Confirm New Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={
                  passwords.confirmPassword
                }
                onChange={
                  handlePasswordChange
                }
              />

              {message && (
                <p className="settings-message">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="settings-primary-button"
              >
                <KeyRound size={18} />
                Change Password
              </button>

            </form>
          </div>

        </div>
      </section>
    );
  }

  /* NOTIFICATIONS */

  if (activeSection === "notifications") {
    return (
      <section className="settings-page">
        <div className="settings-container">

          <button
            type="button"
            className="settings-back-button"
            onClick={goBack}
          >
            ← Back to Settings
          </button>

          <div className="settings-header">
            <p className="section-subtitle">
              PREFERENCES
            </p>

            <h1>Notifications</h1>

            <p>
              Choose which notifications you
              want to receive.
            </p>
          </div>

          <div className="settings-card">

            <div className="settings-toggle-row">

              <div>
                <h3>Order Updates</h3>

                <p>
                  Receive updates about your
                  orders and deliveries.
                </p>
              </div>

              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={
                    notifications.orderUpdates
                  }
                  onChange={() =>
                    handleNotificationChange(
                      "orderUpdates"
                    )
                  }
                />

                <span className="toggle-slider" />
              </label>

            </div>

            <div className="settings-toggle-row">

              <div>
                <h3>Promotions</h3>

                <p>
                  Receive special offers and
                  promotions.
                </p>
              </div>

              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={
                    notifications.promotions
                  }
                  onChange={() =>
                    handleNotificationChange(
                      "promotions"
                    )
                  }
                />

                <span className="toggle-slider" />
              </label>

            </div>

            <div className="settings-toggle-row">

              <div>
                <h3>Wishlist Updates</h3>

                <p>
                  Receive updates about saved
                  products.
                </p>
              </div>

              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={
                    notifications.wishlistUpdates
                  }
                  onChange={() =>
                    handleNotificationChange(
                      "wishlistUpdates"
                    )
                  }
                />

                <span className="toggle-slider" />
              </label>

            </div>

          </div>

        </div>
      </section>
    );
  }

  /* SECURITY */

  if (activeSection === "security") {
    return (
      <section className="settings-page">
        <div className="settings-container">

          <button
            type="button"
            className="settings-back-button"
            onClick={goBack}
          >
            ← Back to Settings
          </button>

          <div className="settings-header">
            <p className="section-subtitle">
              ACCOUNT PROTECTION
            </p>

            <h1>Security</h1>

            <p>
              Manage your account security.
            </p>
          </div>

          <div className="settings-card">

            <div className="security-item security-item-action" role="button" tabIndex="0" onClick={() => openSection("password")} onKeyDown={(event) => event.key === "Enter" && openSection("password")}>

              <div className="security-item-icon">
                <Lock size={22} />
              </div>

              <div>
                <h3>Password Protection</h3>

                <p>Keep your password secure and do not share it.</p>
              </div>

              <Check
                className="security-check"
                size={22}
              />

            </div>

            <div className="security-item security-item-action" role="button" tabIndex="0" onClick={security.emailVerified ? undefined : requestEmailVerification}>

              <div className="security-item-icon">
                <Mail size={22} />
              </div>

              <div>
                <h3>Email Verification</h3>

                <p>{security.emailVerified ? "Your email address is verified." : "Verify your email address for better account protection."}</p>
              </div>

              {security.emailVerified ? <Check className="security-check" size={22} /> : <Mail size={20} className="security-action-icon" />}

            </div>

            {verificationCode && (
              <form className="security-verification-form" onSubmit={verifyEmail}>
                <p>Development verification code: <strong>{verificationCode}</strong></p>
                <input value={enteredCode} onChange={(event) => setEnteredCode(event.target.value)} placeholder="Enter 6-digit code" inputMode="numeric" maxLength={6} required />
                <button type="submit" className="settings-primary-button">Verify Email</button>
              </form>
            )}

            <div className="security-item security-item-action" role="button" tabIndex="0" onClick={toggleTwoFactor} onKeyDown={(event) => event.key === "Enter" && toggleTwoFactor()}>

              <div className="security-item-icon">
                <Smartphone size={22} />
              </div>

              <div>
                <h3>Two-Factor Authentication</h3>

                <p>{security.twoFactorEnabled ? "Two-factor authentication is enabled." : "Add an extra security setting to your account."}</p>
              </div>

              {security.twoFactorEnabled ? <Check className="security-check" size={22} /> : <ChevronRight size={20} />}

            </div>

            {message && <p className="settings-message security-message">{message}</p>}

          </div>

        </div>
      </section>
    );
  }

  /* MAIN SETTINGS MENU */

  return (
    <section className="settings-page">
      <div className="settings-container">

        <div className="settings-header">
          <p className="section-subtitle">
            ACCOUNT SETTINGS
          </p>

          <h1>Settings</h1>

          <p>
            Manage your account preferences
            and security.
          </p>
        </div>

        <div className="settings-card settings-menu">

          {/* CHANGE PASSWORD */}

          <button
            type="button"
            className="settings-menu-item"
            onClick={() =>
              openSection("password")
            }
          >
            <div className="settings-menu-left">

              <div className="settings-icon">
                <KeyRound size={22} />
              </div>

              <div>
                <h3>Change Password</h3>

                <p>
                  Update your account password.
                </p>
              </div>

            </div>

            <ChevronRight size={22} />
          </button>


          {/* NOTIFICATIONS */}

          <button
            type="button"
            className="settings-menu-item"
            onClick={() =>
              openSection("notifications")
            }
          >
            <div className="settings-menu-left">

              <div className="settings-icon">
                <Bell size={22} />
              </div>

              <div>
                <h3>Notifications</h3>

                <p>
                  Manage your notification
                  preferences.
                </p>
              </div>

            </div>

            <ChevronRight size={22} />
          </button>


          {/* SECURITY */}

          <button
            type="button"
            className="settings-menu-item"
            onClick={() =>
              openSection("security")
            }
          >
            <div className="settings-menu-left">

              <div className="settings-icon">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h3>Security</h3>

                <p>
                  Manage account security
                  options.
                </p>
              </div>

            </div>

            <ChevronRight size={22} />
          </button>


        </div>

        {message && (
          <p className="settings-message main-message">
            {message}
          </p>
        )}

      </div>
    </section>
  );
}

export default Settings;