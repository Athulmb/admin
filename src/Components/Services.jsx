import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVICE_API } from "../config"; // updated import

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  const fetchServices = async () => {
    try {
      const res = await axios.get(SERVICE_API);
      setServices(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (image) formData.append("image", image);

    try {
      if (editId) {
        await axios.put(`${SERVICE_API}/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(SERVICE_API, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setTitle("");
      setImage(null);
      setEditId(null);
      setPreview(null);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${SERVICE_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (service) => {
    setTitle(service.title);
    setEditId(service._id);
    setPreview(service.imagePath ? `${SERVICE_API.replace("/api/services","")}${service.imagePath}` : null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Admin: Manage Services</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Service Title"
          className="w-full p-2 text-black rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input type="file" className="w-full text-white" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="w-32 h-24 object-cover rounded mt-2" />}
        <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
          {editId ? "Update Service" : "Add Service"}
        </button>
      </form>

      <div className="space-y-4">
        {services.map((s) => (
          <div key={s._id} className="flex items-center justify-between bg-gray-800 p-4 rounded">
            <div className="flex items-center gap-4">
              {s.imagePath && (
                <img src={`${SERVICE_API.replace("/api/services","")}${s.imagePath}`} alt={s.title} className="w-20 h-16 object-cover rounded" />
              )}
              <span className="font-semibold">{s.title}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(s)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(s._id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;
