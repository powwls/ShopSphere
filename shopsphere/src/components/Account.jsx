import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
} from "lucide-react";

function Account({ currentUser }) {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!currentUser) return;

    async function loadProfile() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user-data/${currentUser.id}/profile`
        );
        const savedProfile = await response.json();

        if (savedProfile) {
          setProfile((previousProfile) => ({
            ...previousProfile,
            ...savedProfile,
          }));
        }
      } catch (error) {
        console.error("Unable to load profile:", error);
      }
    }

    loadProfile();
  }, [currentUser]);

  function handleChange(e) {
    const { name, value } = e.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));
  }

  function handleSave(e) {
    e.preventDefault();

    fetch(
      `http://localhost:5000/api/user-data/${currentUser.id}/profile`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      }
    ).catch((error) => console.error("Unable to save profile:", error));

    setIsEditing(false);
  }

  function handleCancel() {
    setProfile({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: "",
      address: "",
    });

    setIsEditing(false);
  }

  return (
    <section className="account-page">
      <div className="account-container">

        {/* HEADER */}
        <div className="account-header">
          <p className="section-subtitle">
            MY PROFILE
          </p>

          <h1>My Account</h1>

          <p>
            Manage your personal information
            and account details.
          </p>
        </div>

        <div className="account-card">

          {/* PROFILE AVATAR */}
          <div className="account-profile-top">

            <div className="account-avatar">
              <User size={48} />
            </div>

            <div>
              <h2>
                {profile.name || "ShopSphere Customer"}
              </h2>

              <p>
                {profile.email ||
                  "No email added yet"}
              </p>
            </div>

            {!isEditing && (
              <button
                type="button"
                className="edit-profile-button"
                onClick={() =>
                  setIsEditing(true)
                }
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            )}

          </div>

          {/* PROFILE FORM */}
          <form
            className="account-form"
            onSubmit={handleSave}
          >

            {/* NAME */}
            <div className="account-field">
              <label>
                <User size={18} />
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </div>

            {/* EMAIL */}
            <div className="account-field">
              <label>
                <Mail size={18} />
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your email"
              />
            </div>

            {/* PHONE */}
            <div className="account-field">
              <label>
                <Phone size={18} />
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>

            {/* ADDRESS */}
            <div className="account-field account-address-field">
              <label>
                <MapPin size={18} />
                Shipping Address
              </label>

              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your complete address"
                rows="4"
              />
            </div>

            {/* ACTION BUTTONS */}
            {isEditing && (
              <div className="account-actions">

                <button
                  type="button"
                  className="cancel-profile-button"
                  onClick={handleCancel}
                >
                  <X size={18} />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-profile-button"
                >
                  <Save size={18} />
                  Save Changes
                </button>

              </div>
            )}

          </form>

        </div>
      </div>
    </section>
  );
}

export default Account;