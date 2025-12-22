"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { FiX, FiUpload, FiCheck, FiLoader } from "react-icons/fi";
import { API_BASE } from "@/lib/api";
import { useRouter } from "next/navigation";

const AddProductComponent = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    active: true
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = (result) => {
    const url = result?.info?.secure_url;
    if (url) {
      setFormData((prev) => ({ ...prev, image: url }));
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.image || !formData.description) {
      alert("Please fill name, description, and upload image");
      return;
    }
    try {
      setIsUploading(true);  // Loading sync karo upload se
      const body = {
        productName: formData.name.trim(),  // Backend field name
        image: formData.image,
        description: formData.description.trim(),
        status: formData.active ? "active" : "inactive"  // Backend enum
      };
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");  // Backend error catch
      const { data } = await res.json();
      console.log("Product added:", data);
      alert("Product created successfully!");  // Or redirect to list: useRouter se push('/products')
      // Reset form
      setFormData({ name: "", image: "", description: "", active: true });
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsUploading(false);
      router.push("/admin/products")
    }
  };

  const handleCancel = () => {
    router.push("/admin/products")
    console.log("Add product cancelled");
    setFormData({ name: "", image: "", description: "", active: true });  // Reset on cancel
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-linear-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Add New Product</h2>
            {/* <p className="text-sm text-gray-500 mt-1">Create a new product</p> */}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-8 md:p-10 space-y-6 backdrop-blur-sm" >
          {/* Product Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700" >Product Name</label>
            <input type="text" id="name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value })) } placeholder="Enter product name..." className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400" required />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Image
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
                  className="relative border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all duration-300 group"
                >
                  {isUploading ? (
                    <div className="space-y-4">
                      <FiLoader className="w-14 h-14 mx-auto animate-spin text-amber-500" />
                      <p className="text-gray-600 font-medium">Uploading...</p>
                    </div>
                  ) : formData?.image ? (
                    <div className="space-y-4">
                      <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden border-2 border-amber-200 shadow-lg bg-white">
                        <img
                          src={formData.image}
                          alt="Image Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-700 font-medium">
                          Image uploaded
                        </p>
                        <p className="text-xs text-gray-500">Click to change</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center group-hover:bg-amber-100 transition-colors duration-300">
                        <FiUpload className="w-8 h-8 text-amber-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-700 font-medium">
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
          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea rows={4}  value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value, })) } placeholder="Enter product description..." className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 resize-none" />
          </div>
          {/* Description div ke baad */}
          <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
              className="size-4 text-amber-500 border-gray-300 rounded focus:ring-2 focus:ring-amber-500/50 transition-all duration-200"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer">
              Set as Active
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300/50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isUploading || !formData.image || !formData.description}
            >
              <FiCheck className="w-4 h-4" />
              <span>Save Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductComponent;
