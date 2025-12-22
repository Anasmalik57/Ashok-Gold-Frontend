"use client";

import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiFilter } from "react-icons/fi";
import AddBannerModal from "./Modals/AddBannerModal";
import { API_BASE } from "@/lib/api";

const BannerListComponent = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    active: true,
  });

  // ============================================================================
  // ============================ Fetch Banner Logic ============================
  // ============================================================================

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/banners`); // Optional: ?status=active for filtered
      if (!res.ok) throw new Error("Fetch failed");
      const { data } = await res.json();
      // Map backend data to frontend format
      const mapped = data.map((ban) => ({
        id: ban._id,
        name: ban.bannerName,
        image: ban.image,
        active: ban.status === "active",
      }));
      setBanners(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ============================================================================

  // Filter banners based on search and status
  const filteredBanners = banners.filter((banner) => {
    const matchesSearch = banner.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && banner.active) ||
      (filterStatus === "inactive" && !banner.active);
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      name: banner.name,
      image: banner.image,
      active: banner.active,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this banner?')) {
    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchBanners(); // Refetch
    } catch (err) { 
      alert(err.message);
    }
  }
};

  const handleSave = async () => {
    if (!formData.name || !formData.image) {
      alert("Please fill name and upload image");
      return;
    }
    try {
      const body = {
        bannerName: formData.name.trim(),
        image: formData.image,
        status: formData.active ? "active" : "inactive",
      };
      let res;
      if (editingBanner) {
        res = await fetch(`${API_BASE}/banners/${editingBanner.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`${API_BASE}/banners`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) throw new Error("Save failed");
      fetchBanners(); // Refetch after save
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };
  const closeModal = () => {
    setShowAddModal(false);
    setEditingBanner(null);
    setFormData({ name: "", image: "", active: true });
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({ name: "", image: "", active: true });
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Banner Management
          </h1>
          <p className="text-gray-600">
            Manage your product banners efficiently
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Controls */}
          <div className="p-4 md:p-6 border-b border-gray-200 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search banners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filter & Add Button */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      filterStatus === "all"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus("active")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      filterStatus === "active"
                        ? "bg-white text-green-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterStatus("inactive")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      filterStatus === "inactive"
                        ? "bg-white text-red-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Inactive
                  </button>
                </div>

                <button
                  onClick={openAddModal}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <FiPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Banner</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredBanners.length}
              </span>{" "}
              of {banners.length} banners
            </p>
          </div>

          {loading && <div className="p-8 text-center">Loading banners...</div>}
          {error && <div className="p-8 text-center text-red-500">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto">
            {!loading && !error && (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Banner
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                      Image
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBanners.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <FiSearch className="w-12 h-12 mb-3" />
                          <p className="text-lg font-medium text-gray-900">
                            No Banners found
                          </p>
                          <p className="text-sm mt-1">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBanners.map((banner) => (
                      <tr
                        key={banner.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              className="h-10 w-10 rounded-lg object-cover sm:hidden border border-gray-200"
                              src={banner.image}
                              alt={banner.name}
                            />
                            <div className="text-sm font-semibold text-gray-900">
                              {banner.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                          <img
                            className="size-10 object-cover rounded-full"
                            src={banner.image}
                            alt={banner.name}
                          />
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                              banner.active
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {banner.active ? "Active" : "Inactive"}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(banner)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Edit banner"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(banner.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete banner"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <AddBannerModal
            handleSave={handleSave}
            closeModal={closeModal}
            formData={formData}
            setFormData={setFormData}
            editingBanner={editingBanner}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BannerListComponent;
