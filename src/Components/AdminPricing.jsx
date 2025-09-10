import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, X, Plus } from "lucide-react";

const API = "http://localhost:7000/api/pricing"; // backend endpoint

const AdminPricing = () => {
  const [pricings, setPricings] = useState([]);
  const [selectedPricing, setSelectedPricing] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState([""]);
  const [isPopular, setIsPopular] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all pricing plans
  const fetchPricings = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setPricings(data.pricings || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPricings();
  }, []);

  // Add / remove feature inputs
  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeatureField = () => setFeatures([...features, ""]);
  const removeFeatureField = (index) =>
    setFeatures(features.filter((_, i) => i !== index));

  // Open form for new pricing
  const openNewForm = () => {
    setEditId(null);
    setDuration("");
    setPrice("");
    setFeatures([""]);
    setIsPopular(false);
    setIsFormOpen(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!duration || !price) return;

    try {
      const options = {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          duration,
          price: Number(price),
          features,
          isPopular,
        }),
      };

      const res = await fetch(editId ? `${API}/${editId}` : API, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error occurred");

      setIsFormOpen(false);
      setEditId(null);
      fetchPricings();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Edit
  const handleEdit = (pricing) => {
    setEditId(pricing._id);
    setDuration(pricing.duration);
    setPrice(pricing.price);
    setFeatures(pricing.features);
    setIsPopular(pricing.isPopular);
    setIsFormOpen(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pricing?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      fetchPricings();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // View Details
  const handleDetails = (pricing) => {
    setSelectedPricing(pricing);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Admin: Manage Pricing Plans</h2>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          <Plus size={18} /> Add New Plan
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 rounded p-4">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr className="text-left text-gray-300">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Features</th>
              <th className="px-4 py-2">Popular</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {pricings.map((p, idx) => (
              <tr key={p._id}>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{p.duration}</td>
                <td className="px-4 py-2">${p.price}</td>
                <td className="px-4 py-2 truncate max-w-xs">
                  {p.features.join(", ")}
                </td>
                <td className="px-4 py-2">{p.isPopular ? "Yes" : "No"}</td>
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
      {isDetailOpen && selectedPricing && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 p-1 bg-gray-700 rounded"
              onClick={() => setIsDetailOpen(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedPricing.duration}</h3>
            <p className="mb-2 text-gray-300">Price: ${selectedPricing.price}</p>
            <p className="text-gray-300 mb-2">Popular: {selectedPricing.isPopular ? "Yes" : "No"}</p>
            <div className="text-gray-300">
              Features:
              <ul className="list-disc pl-5 mt-1">
                {selectedPricing.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
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
              {editId ? "Edit Pricing Plan" : "Add New Pricing Plan"}
            </h3>

            <input
              type="text"
              placeholder="Duration"
              className="w-full p-2 rounded text-black"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Price"
              className="w-full p-2 rounded text-black"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            {/* Features */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-200">Features:</label>
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    className="w-full p-2 rounded text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeFeatureField(idx)}
                    className="bg-red-600 px-2 rounded text-white"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeatureField}
                className="bg-green-600 px-4 py-1 rounded text-white w-fit"
              >
                + Add Feature
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
              />
              <label>Mark as Popular</label>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              {editId ? "Update Plan" : "Add Plan"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPricing;
