import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { FiX, FiUpload, FiLoader, FiImage } from "react-icons/fi";

const AddProductModal = ({
  handleSave,
  closeModal,
  formData,
  setFormData,
  editingProduct,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = (result) => {
    const url = result?.info?.secure_url;
    if (url) {
      setFormData({ ...formData, image: url });
    }
    setIsUploading(false);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setFormData({ ...formData, image: "" });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={closeModal}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400"
              placeholder="Enter product name"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Image
            </label>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={handleUploadSuccess}
              onQueuesStart={() => setIsUploading(true)}
              onQueuesEnd={() => setIsUploading(false)}
            >
              {({ open }) => (
                <div
                  onClick={() => open()}
                  className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all duration-300 group"
                >
                  {isUploading ? (
                    <div className="space-y-3">
                      <FiLoader className="w-10 h-10 mx-auto animate-spin text-amber-500" />
                      <p className="text-gray-600 text-sm font-medium">
                        Uploading...
                      </p>
                    </div>
                  ) : formData?.image ? (
                    <div className="space-y-3">
                      <div className="size-40 mx-auto rounded-xl overflow-hidden border-2 border-amber-200 shadow-md bg-white">
                        <img
                          src={formData.image}
                          alt="Product Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-700 text-sm font-medium">
                          Image uploaded
                        </p>
                        <p className="text-xs text-gray-500">Click to change</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md"
                      >
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors duration-300">
                        <FiImage className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-700 text-sm font-medium">
                          Upload Image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG or GIF · Max 2MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CldUploadWidget>
          </div>

          {/* Image Upload ke baad, Active Checkbox se pehle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              value={formData.description || ""} // Default empty
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 resize-vertical"
              placeholder="Enter product description..."
              rows={4} // Height adjust
              required // Optional, but good UX
            />
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              className="size-4 text-amber-500 border-gray-300 rounded focus:ring-2 focus:ring-amber-500/50 transition-all duration-200"
            />
            <label
              htmlFor="active"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Set as Active
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={closeModal}
              className="flex-1 px-4 py-3 text-sm cursor-pointer border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 text-sm cursor-pointer bg-linear-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 font-semibold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isUploading || !formData.image || !formData.description}
            >
              {editingProduct ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddProductModal;
