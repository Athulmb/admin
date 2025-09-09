import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, X, Plus } from "lucide-react";

const API = "http://localhost:7000/api/programs";
const BASE_URL = "http://localhost:7000";

const subtitleOptions = [
  "7 Week · 5x/week",
  "5 Week · 4x/week",
  "6 Week · 6x/week",
  "4 Week · 3x/week",
  "3 Week · 5x/week",
  "4 Week · 4x/week",
];

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState(subtitleOptions[0]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPrograms = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setPrograms(data.programs || data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
    setRemoveImage(false);
  };

  const openNewProgramForm = () => {
    setEditId(null);
    setTitle("");
    setSubtitle(subtitleOptions[0]);
    setImage(null);
    setPreview(null);
    setRemoveImage(false);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subtitle) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    if (image) formData.append("image", image);
    if (removeImage) formData.append("removeImage", "true");

    try {
      const options = {
        method: editId ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      };

      const res = await fetch(editId ? `${API}/${editId}` : API, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error occurred");

      setTitle("");
      setSubtitle(subtitleOptions[0]);
      setImage(null);
      setPreview(null);
      setEditId(null);
      setRemoveImage(false);
      setIsFormOpen(false);
      fetchPrograms();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleEdit = (program) => {
    setEditId(program._id);
    setTitle(program.title);
    setSubtitle(program.subtitle);
    setPreview(program.image ? `${BASE_URL}${program.image}` : null);
    setImage(null);
    setRemoveImage(false);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      fetchPrograms();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDetails = (program) => {
    setSelectedProgram(program);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Admin: Manage Programs</h2>
        <button
          onClick={openNewProgramForm}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          <Plus size={18} /> Add New Program
        </button>
      </div>

      {/* Programs Table */}
      <div className="overflow-x-auto bg-gray-800 rounded p-4">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr className="text-left text-gray-300">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Subtitle</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {programs.map((p, idx) => (
              <tr key={p._id}>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{p.title}</td>
                <td className="px-4 py-2">{p.subtitle}</td>
                <td className="px-4 py-2">
                  {p.image && (
                    <img
                      src={`${BASE_URL}${p.image}`}
                      alt={p.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleDetails(p)}
                    className="p-1 bg-blue-500 hover:bg-blue-600 rounded"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-1 bg-green-500 hover:bg-green-600 rounded"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-1 bg-red-500 hover:bg-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedProgram && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 p-1 bg-gray-700 rounded"
              onClick={() => setIsDetailOpen(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedProgram.title}</h3>
            <p className="mb-4 text-gray-300">{selectedProgram.subtitle}</p>
            {selectedProgram.image && (
              <img
                src={`${BASE_URL}${selectedProgram.image}`}
                alt={selectedProgram.title}
                className="w-full h-48 object-cover rounded"
              />
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full relative space-y-4"
          >
            <button
              className="absolute top-3 right-3 p-1 bg-gray-700 rounded"
              onClick={() => setIsFormOpen(false)}
              type="button"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold">
              {editId ? "Edit Program" : "Add New Program"}
            </h3>

            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 rounded text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <select
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full p-2 rounded text-black"
            >
              {subtitleOptions.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <div className="flex flex-col gap-2">
              <input type="file" className="w-full text-white" onChange={handleImageChange} />
              {preview && (
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-32 h-24 object-cover rounded" />
                  {editId && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                        setRemoveImage(true);
                      }}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                      title="Remove Image"
                    >
                      X
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              {editId ? "Update Program" : "Add Program"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPrograms;
