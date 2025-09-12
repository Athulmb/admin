// src/pages/Admin/Users.jsx
import React, { useEffect, useState } from "react";
import { AUTH_API } from "../config"; // adjust the path if needed
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${AUTH_API}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("API response:", res.data);
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Fetch users error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading users...</p>;
  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-black rounded-lg shadow-sm">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{user.fullName}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2">{user.isActive ? "Active" : "Inactive"}</td>
                  <td className="border p-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
