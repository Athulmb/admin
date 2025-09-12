import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, X, Plus } from "lucide-react";
import { USERSTORY_API, BASE_URL } from "../config"; // use config.js

const AdminUserStories = () => {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [bg, setBg] = useState(null);
  const [video, setVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewBg, setPreviewBg] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch stories
  const fetchStories = async () => {
    try {
      const res = await fetch(USERSTORY_API);
      const data = await res.json();
      setStories(data.stories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // File change handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  };
  const handleBgChange = (e) => {
    const file = e.target.files[0];
    setBg(file);
    setPreviewBg(file ? URL.createObjectURL(file) : null);
  };
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setPreviewVideo(file ? URL.createObjectURL(file) : null);
  };

  // Open new story form
  const openNewForm = () => {
    setEditId(null);
    setName("");
    setTitle("");
    setImage(null);
    setBg(null);
    setVideo(null);
    setPreviewImage(null);
    setPreviewBg(null);
    setPreviewVideo(null);
    setIsFormOpen(true);
  };

  // Submit add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !title) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    if (image) formData.append("image", image);
    if (bg) formData.append("bg", bg);
    if (video) formData.append("video", video);

    try {
      const options = {
        method: editId ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      };

      const res = await fetch(editId ? `${USERSTORY_API}/${editId}` : USERSTORY_API, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error occurred");

      fetchStories();
      setIsFormOpen(false);
      setEditId(null);
      setName("");
      setTitle("");
      setImage(null);
      setBg(null);
      setVideo(null);
      setPreviewImage(null);
      setPreviewBg(null);
      setPreviewVideo(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Edit story
  const handleEdit = (story) => {
    setEditId(story._id);
    setName(story.name);
    setTitle(story.title);
    setPreviewImage(story.image ? `${BASE_URL}${story.image}` : null);
    setPreviewBg(story.bg ? `${BASE_URL}${story.bg}` : null);
    setPreviewVideo(story.videoUrl ? `${BASE_URL}${story.videoUrl}` : null);
    setImage(null);
    setBg(null);
    setVideo(null);
    setIsFormOpen(true);
  };

  // Delete story
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      const res = await fetch(`${USERSTORY_API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      fetchStories();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Open details modal
  const handleDetails = (story) => {
    setSelectedStory(story);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Admin: Manage User Stories</h2>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          <Plus size={18} /> Add New Story
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 rounded p-4">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr className="text-left text-gray-300">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">BG</th>
              <th className="px-4 py-2">Video</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {stories.map((s, idx) => (
              <tr key={s._id}>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.title}</td>
                <td className="px-4 py-2">
                  {s.image && (
                    <img
                      src={`${BASE_URL}${s.image}`}
                      alt={s.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  {s.bg && (
                    <img
                      src={`${BASE_URL}${s.bg}`}
                      alt={s.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  {s.videoUrl && (
                    <video className="w-32 h-16 object-cover rounded" controls>
                      <source src={`${BASE_URL}${s.videoUrl}`} type="video/mp4" />
                    </video>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleDetails(s)} className="p-1 bg-blue-500 hover:bg-blue-600 rounded">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleEdit(s)} className="p-1 bg-green-500 hover:bg-green-600 rounded">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="p-1 bg-red-500 hover:bg-red-600 rounded">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedStory && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 p-1 bg-gray-700 rounded"
              onClick={() => setIsDetailOpen(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedStory.name}</h3>
            <p className="mb-4 text-gray-300">{selectedStory.title}</p>
            {selectedStory.image && <img src={`${BASE_URL}${selectedStory.image}`} alt="Image" className="w-full h-48 object-cover rounded mb-2" />}
            {selectedStory.bg && <img src={`${BASE_URL}${selectedStory.bg}`} alt="BG" className="w-full h-48 object-cover rounded mb-2" />}
            {selectedStory.videoUrl && <video src={`${BASE_URL}${selectedStory.videoUrl}`} controls className="w-full h-48 rounded" />}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 max-w-md w-full relative space-y-4">
            <button
              className="absolute top-3 right-3 p-1 bg-gray-700 rounded"
              onClick={() => setIsFormOpen(false)}
              type="button"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold">{editId ? "Edit Story" : "Add New Story"}</h3>

            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 rounded text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 rounded text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Image */}
            <div className="flex flex-col gap-2">
              <label>Thumbnail Image</label>
              <input type="file" className="w-full text-white" onChange={handleImageChange} />
              {previewImage && <img src={previewImage} alt="Preview" className="w-32 h-24 object-cover rounded" />}
            </div>

            {/* Background */}
            <div className="flex flex-col gap-2">
              <label>Background Image</label>
              <input type="file" className="w-full text-white" onChange={handleBgChange} />
              {previewBg && <img src={previewBg} alt="Preview" className="w-32 h-24 object-cover rounded" />}
            </div>

            {/* Video */}
            <div className="flex flex-col gap-2">
              <label>Video</label>
              <input type="file" className="w-full text-white" onChange={handleVideoChange} />
              {previewVideo && <video src={previewVideo} controls className="w-32 h-24 rounded" />}
            </div>

            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
              {editId ? "Update Story" : "Add Story"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUserStories;
