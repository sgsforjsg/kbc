import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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

  const handleProfilePicUpload = (e) => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
      <div className="bg-red-500 text-white p-4">
  Tailwind CSS is working!
</div>

        
        
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome--, {userData?.name || user.email}!
        </h1>

        {/* Profile Picture */}
        {userData?.profilePic && (
          <div className="flex justify-center mb-6">
            <img
              src={userData.profilePic}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-md"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            onChange={handleProfilePicUpload}
            className="mt-2 block w-full text-sm text-gray-500"
          />
          <button
            onClick={handleProfilePicSubmit}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload Profile Picture
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleUpdateProfile}
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Save Profile
          </button>

          <button
            onClick={logout}
            className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoggedInScreen;
