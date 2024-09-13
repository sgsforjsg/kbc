import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const LoggedInScreen = () => {
  const { user, userData, updateProfile, uploadProfilePic, logout } = useAuth();
  const [name, setName] = useState(userData?.name || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [role, setRole] = useState(userData?.role || "user");
  const [profilePic, setProfilePic] = useState(null);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(user.uid, { name, phone, role });
      alert("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const handleProfilePicSubmit = async () => {
    if (profilePic) {
      try {
        await uploadProfilePic(user.uid, profilePic);
        alert("Profile picture updated!");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload profile picture.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Welcome, {userData?.name || user.email}!</h1>

      {/* Display profile picture if it exists */}
      {userData?.profilePic && (
        <div className="mt-4">
          <img
            src={userData.profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      )}

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded mt-2 w-full"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-2 border rounded mt-2 w-full"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 border rounded mt-2 w-full"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <input type="file" onChange={handleProfilePicUpload} className="mt-2" />
        <button onClick={handleProfilePicSubmit} className="bg-blue-500 text-white p-2 rounded mt-4">
          Upload Profile Picture
        </button>
      </div>

      <button onClick={handleUpdateProfile} className="bg-green-500 text-white p-2 rounded mt-4">
        Save Profile
      </button>

      {/* Show Admin Page link if user is an admin */}
      {role === "admin" && (
        <Link to="/admin">
          <button className="bg-purple-500 text-white p-2 rounded mt-4">Go to Admin Page</button>
        </Link>
      )}

      <button onClick={logout} className="bg-red-500 text-white p-2 rounded mt-4">
        Logout
      </button>
    </div>
  );
};

export default LoggedInScreen;
