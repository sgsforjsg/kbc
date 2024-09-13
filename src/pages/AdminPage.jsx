import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore"; // To fetch users data
import { db } from "../firebase"; // Firebase Firestore instance

const AdminPage = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => doc.data());
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex justify-between items-center mb-8">
        <p>Welcome, Admin {user.email}</p>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b">{user.name || "N/A"}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.phone || "N/A"}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
