// src/pages/Admin/AdminSports.jsx
import React, { useState, useEffect } from "react";
import { SPORTS_API, BASE_URL } from "../config"; // use config.js

const AdminSports = () => {
  const [sports, setSports] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ Fetch Sports
  const fetchSports = async () => {
    try {
      const res = await fetch(SPORTS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSports(data.sports || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  // ✅ Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      if (image) formData.append("image", image);

      const method = editId ? "PUT" : "POST";
      const url = editId ? `${SPORTS_API}/${editId}` : SPORTS_API;

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        fetchSports();
        resetForm();
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sport?")) return;
    try {
      const res = await fetch(`${SPORTS_API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchSports();
      else alert(data.message || "Failed to delete");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Edit Mode
  const handleEdit = (sport) => {
    setEditId(sport._id);
    setTitle(sport.title);
  };

  // ✅ Reset Form
  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200">
        ⚽ Admin Sports
      </h2>

      {/* Form */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-10 shadow-lg max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-green-300">
          {editId ? "✏️ Edit Sport" : "➕ Add New Sport"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Sport Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded-md w-full bg-white/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="p-2 rounded-md w-full bg-white/10 border border-white/20 text-gray-300"
          />

          <div className="flex gap-3 col-span-1 md:col-span-3">
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md transition shadow-md"
            >
              {editId ? "Update Sport" : "Create Sport"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Sports Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sports.map((sport) => (
          <div
            key={sport._id}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-md hover:shadow-green-400/20 transition"
          >
            {sport.image ? (
              <img
                src={`${BASE_URL}${sport.image}`}
                alt={sport.title}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-black/30 text-gray-400">
                No Image
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-green-300">{sport.title}</h3>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(sport)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sport._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sports.length === 0 && (
        <p className="text-center text-gray-400 mt-6">
          No sports found. Add one to get started 🚀
        </p>
      )}
    </div>
  );
};

export default AdminSports;
