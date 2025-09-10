import React, { useState, useEffect } from "react";

const API = "http://localhost:7000/api/centers";

const AdminCenters = () => {
  const [centers, setCenters] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  // ✅ Fetch centers
  const fetchCenters = async () => {
    try {
      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) setCenters(data.centers);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  // ✅ Handle Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      if (image) formData.append("image", image);

      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API}/${editId}` : API;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        fetchCenters();
        resetForm();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // ✅ Delete center
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this center?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (data.success) fetchCenters();
      else alert(data.message);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Edit mode
  const handleEdit = (center) => {
    setEditId(center._id);
    setTitle(center.title);
    setLocation(center.location);
  };

  // ✅ Reset form
  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setLocation("");
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200">
        🏋️ Admin Centers
      </h2>

      {/* Form */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-10 shadow-lg max-w-5xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-green-300">
          {editId ? "✏️ Edit Center" : "➕ Add New Center"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="Center Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded-md w-full bg-white/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
              {editId ? "Update Center" : "Create Center"}
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

      {/* Centers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {centers.map((center) => (
          <div
            key={center._id}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-md hover:shadow-green-400/20 transition"
          >
            {center.image ? (
              <img
                src={`http://localhost:7000${center.image}`}
                alt={center.title}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-black/30 text-gray-400">
                No Image
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-green-300">
                {center.title}
              </h3>
              <p className="text-gray-300">{center.location}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(center)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(center._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {centers.length === 0 && (
        <p className="text-center text-gray-400 mt-6">
          No centers found. Add one to get started 🚀
        </p>
      )}
    </div>
  );
};

export default AdminCenters;
