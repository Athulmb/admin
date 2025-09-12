import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, X, Plus } from "lucide-react";

import { BASE_URL, ABOUT_API } from "../config";

// Use
const API = ABOUT_API; // now specific for About


const AdminAbout = () => {
  const [about, setAbout] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    heroDescription: "",
    heroBgImage: null,
    qrImg: null,
    descriptionTexts: [""],
    descriptionImages: [],
    trainerTexts: [""],
    trainerImage: null,
  });

  // ✅ Fetch About (only one record)
  const fetchAbout = async () => {
    const res = await fetch(API);
    const data = await res.json();
    if (data.success) setAbout(data.about);
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // ✅ Handle form input
  const handleInputChange = (e, index, field, section) => {
    if (section === "descriptionTexts") {
      const texts = [...formData.descriptionTexts];
      texts[index] = e.target.value;
      setFormData({ ...formData, descriptionTexts: texts });
    } else if (section === "trainerTexts") {
      const texts = [...formData.trainerTexts];
      texts[index] = e.target.value;
      setFormData({ ...formData, trainerTexts: texts });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleFileChange = (e, field, multiple = false) => {
    if (multiple) {
      setFormData({ ...formData, [field]: Array.from(e.target.files) });
    } else {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  // ✅ Submit Form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append("hero[description]", formData.heroDescription);
    if (formData.heroBgImage) form.append("heroBgImage", formData.heroBgImage);
    if (formData.qrImg) form.append("qrImg", formData.qrImg);

    formData.descriptionTexts.forEach((t) => form.append("description[texts][]", t));
    formData.descriptionImages.forEach((img) => form.append("descriptionImages", img));

    formData.trainerTexts.forEach((t) => form.append("trainer[texts][]", t));
    if (formData.trainerImage) form.append("trainerImage", formData.trainerImage);

    const method = editMode ? "PUT" : "POST";
    const url = editMode ? `${API}/${about._id}` : API;

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ JWT
      },
      body: form,
    });

    const data = await res.json();
    if (data.success) {
      setFormVisible(false);
      fetchAbout();
    } else {
      alert(data.message);
    }
  };

  // ✅ Delete About
  const handleDelete = async () => {
    const res = await fetch(`${API}/${about._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (data.success) {
      setAbout(null);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - About Page</h1>

      {/* ✅ If no About, show Create */}
      {!about && (
        <button
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg"
          onClick={() => {
            setEditMode(false);
            setFormVisible(true);
          }}
        >
          <Plus size={18} /> Create About Page
        </button>
      )}

      {/* ✅ Show About if exists */}
      {about && (
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold">Current About Page</h2>

          {/* Hero Section */}
          <div className="mt-3">
            <h3 className="font-semibold">Hero</h3>
            {about.hero?.bgImage && (
              <img
                src={`${BASE_URL}${about.hero.bgImage}`}
                alt="Hero"
                className="w-48 h-32 object-cover rounded"
              />
            )}
            <p>{about.hero?.description}</p>
            {about.hero?.qrImg && (
              <img
                src={`${BASE_URL}${about.hero.qrImg}`}
                alt="QR"
                className="w-32 mt-2"
              />
            )}
          </div>

          {/* Description Section */}
          <div className="mt-3">
            <h3 className="font-semibold">Description</h3>
            <ul className="list-disc ml-6">
              {about.description?.texts?.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
            <div className="flex gap-2 mt-2">
              {about.description?.images?.map((img, i) => (
                <img
                  key={i}
                  src={`${BASE_URL}${img}`}
                  alt="desc"
                  className="w-32 h-20 object-cover rounded"
                />
              ))}
            </div>
          </div>

          {/* Trainer Section */}
          <div className="mt-3">
            <h3 className="font-semibold">Trainer</h3>
            {about.trainer?.image && (
              <img
                src={`${BASE_URL}${about.trainer.image}`}
                alt="Trainer"
                className="w-40 rounded-lg"
              />
            )}
            <ul className="list-disc ml-6">
              {about.trainer?.texts?.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded"
              onClick={() => {
                setEditMode(true);
                setFormVisible(true);
                setFormData({
                  heroDescription: about.hero?.description || "",
                  heroBgImage: null,
                  qrImg: null,
                  descriptionTexts: about.description?.texts || [""],
                  descriptionImages: [],
                  trainerTexts: about.trainer?.texts || [""],
                  trainerImage: null,
                });
              }}
            >
              <Pencil size={16} /> Edit
            </button>
            <button
              className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded"
              onClick={handleDelete}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* ✅ Form Modal */}
      {formVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editMode ? "Edit About" : "Create About"}
              </h2>
              <button onClick={() => setFormVisible(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hero */}
              <div>
                <label className="block mb-1">Hero Description</label>
                <input
                  type="text"
                  value={formData.heroDescription}
                  onChange={(e) => handleInputChange(e, null, "heroDescription")}
                  className="w-full p-2 rounded bg-gray-700"
                />
              </div>
              <div>
                <label>Hero Background Image</label>
                <input type="file" onChange={(e) => handleFileChange(e, "heroBgImage")} />
              </div>
              <div>
                <label>QR Image</label>
                <input type="file" onChange={(e) => handleFileChange(e, "qrImg")} />
              </div>

              {/* Description */}
              <div>
                <label>Description Texts</label>
                {formData.descriptionTexts.map((t, i) => (
                  <input
                    key={i}
                    type="text"
                    value={t}
                    onChange={(e) => handleInputChange(e, i, null, "descriptionTexts")}
                    className="w-full p-2 mb-2 rounded bg-gray-700"
                  />
                ))}
                <button
                  type="button"
                  className="bg-green-600 px-2 py-1 rounded"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      descriptionTexts: [...formData.descriptionTexts, ""],
                    })
                  }
                >
                  + Add Text
                </button>
              </div>
              <div>
                <label>Description Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(e, "descriptionImages", true)}
                />
              </div>

              {/* Trainer */}
              <div>
                <label>Trainer Texts</label>
                {formData.trainerTexts.map((t, i) => (
                  <input
                    key={i}
                    type="text"
                    value={t}
                    onChange={(e) => handleInputChange(e, i, null, "trainerTexts")}
                    className="w-full p-2 mb-2 rounded bg-gray-700"
                  />
                ))}
                <button
                  type="button"
                  className="bg-green-600 px-2 py-1 rounded"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      trainerTexts: [...formData.trainerTexts, ""],
                    })
                  }
                >
                  + Add Text
                </button>
              </div>
              <div>
                <label>Trainer Image</label>
                <input type="file" onChange={(e) => handleFileChange(e, "trainerImage")} />
              </div>

              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded text-white w-full"
              >
                {editMode ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAbout;
