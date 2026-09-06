import { useState } from "react";
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

            <div className="security-item">

              <div className="security-item-icon">
                <Lock size={22} />
              </div>

              <div>
                <h3>Password Protection</h3>

                <p>
                  Keep your password secure
                  and do not share it.
                </p>
              </div>

              <Check
                className="security-check"
                size={22}
              />

            </div>

            <div className="security-item">

              <div className="security-item-icon">
                <Mail size={22} />
              </div>

              <div>
                <h3>Email Verification</h3>

                <p>
                  Email verification will be
                  available after Login and
                  Signup are implemented.
                </p>
              </div>

            </div>

            <div className="security-item">

              <div className="security-item-icon">
                <Smartphone size={22} />
              </div>

              <div>
                <h3>Two-Factor Authentication</h3>

                <p>
                  Additional account protection
                  will be available later.
                </p>
              </div>

            </div>

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