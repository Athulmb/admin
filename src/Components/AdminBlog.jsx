import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, X, Plus } from "lucide-react";

import { BASE_URL, BLOG_API } from "../config";

// Use
const API = BLOG_API; // now specific for About

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    tag: "",
    date: "",
    time: "",
    image: null,
    videoUrl: "",
    isTrending: false,
  });

  // ✅ Fetch all blogs
  const fetchBlogs = async () => {
    const res = await fetch(API);
    const data = await res.json();
    if (data.success) setBlogs(data.blogs);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Handle form inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // ✅ Submit form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("tag", formData.tag);
    form.append("date", formData.date);
    form.append("time", formData.time);
    form.append("videoUrl", formData.videoUrl);
    form.append("isTrending", formData.isTrending);

    if (formData.image) form.append("image", formData.image);

    const method = editMode ? "PUT" : "POST";
    const url = editMode ? `${API}/${selectedBlog._id}` : API;

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: form,
    });

    const data = await res.json();
    if (data.success) {
      setFormVisible(false);
      fetchBlogs();
    } else {
      alert(data.message);
    }
  };

  // ✅ Delete blog
  const handleDelete = async (blog) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    const res = await fetch(`${API}/${blog._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    if (data.success) fetchBlogs();
    else alert(data.message);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Blogs</h1>

      {/* ✅ Add Blog */}
      <button
        className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg mb-4"
        onClick={() => {
          setEditMode(false);
          setFormVisible(true);
          setFormData({
            title: "",
            tag: "",
            date: "",
            time: "",
            image: null,
            videoUrl: "",
            isTrending: false,
          });
        }}
      >
        <Plus size={18} /> Add Blog
      </button>

      {/* ✅ Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold">{blog.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditMode(true);
                    setFormVisible(true);
                    setSelectedBlog(blog);
                    setFormData({
                      title: blog.title,
                      tag: blog.tag,
                      date: blog.date,
                      time: blog.time,
                      image: null,
                      videoUrl: blog.videoUrl,
                      isTrending: blog.isTrending,
                    });
                  }}
                  className="bg-blue-600 px-2 py-1 rounded"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(blog)}
                  className="bg-red-600 px-2 py-1 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Thumbnail */}
            {blog.image && (
              <img
                src={`${BASE_URL}${blog.image}`}
                alt={blog.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}

            <p className="text-sm text-gray-300">
              <span className="font-semibold">Tag:</span> {blog.tag} |{" "}
              <span className="font-semibold">Date:</span> {blog.date} |{" "}
              <span className="font-semibold">Read Time:</span> {blog.time}
            </p>

            {blog.isTrending && (
              <span className="inline-block mt-2 bg-green-500 px-2 py-1 text-xs rounded">
                Trending
              </span>
            )}

            {blog.videoUrl && (
              <p className="mt-1 text-xs text-gray-400">Video URL: {blog.videoUrl}</p>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Form Modal */}
      {formVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-[500px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editMode ? "Edit Blog" : "Add Blog"}
              </h2>
              <button onClick={() => setFormVisible(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label>Title</label>
    <input
      type="text"
      name="title"
      value={formData.title}
      onChange={handleInputChange}
      className="w-full p-2 rounded bg-gray-700"
      required
    />
  </div>

  <div>
    <label>Tag</label>
    <input
      type="text"
      name="tag"
      value={formData.tag}
      onChange={handleInputChange}
      className="w-full p-2 rounded bg-gray-700"
      required
    />
  </div>

  <div>
    <label>Date</label>
    <input
      type="date"
      name="date"
      value={formData.date}
      onChange={handleInputChange}
      className="w-full p-2 rounded bg-gray-700"
      required
    />
  </div>

  <div>
    <label>Read Time</label>
    <input
      type="time"
      name="time"
      value={formData.time}
      onChange={handleInputChange}
      className="w-full p-2 rounded bg-gray-700"
      required
    />
  </div>

  <div>
    <label>Video URL</label>
    <input
      type="text"
      name="videoUrl"
      value={formData.videoUrl}
      onChange={handleInputChange}
      className="w-full p-2 rounded bg-gray-700"
    />
  </div>

  <div>
    <label>Thumbnail Image</label>
    <input type="file" onChange={handleFileChange} />
  </div>

  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      name="isTrending"
      checked={formData.isTrending}
      onChange={handleInputChange}
    />
    <label>Trending</label>
  </div>

  <button
    type="submit"
    className="bg-blue-600 px-4 py-2 rounded text-white w-full"
  >
    {editMode ? "Update Blog" : "Add Blog"}
  </button>
</form>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
