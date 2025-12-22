"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiHome,
  FiPlusSquare,
  FiList,
  FiPhone,
  FiLogOut,
} from "react-icons/fi";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    { href: "/admin/dashboard", icon: FiHome, label: "Dashboard" },
    {
      section: "Categories",
      items: [
        {
          href: "/admin/categories/create",
          icon: FiPlusSquare,
          label: "Create Category",
        },
        { href: "/admin/categories", icon: FiList, label: "Categories List" },
      ],
    },
    {
      section: "Products",
      items: [
        {
          href: "/admin/products/add",
          icon: FiPlusSquare,
          label: "Add Product",
        },
        { href: "/admin/products", icon: FiList, label: "Products List" },
      ],
    },
    {
      section: "Banners",
      items: [
        { href: "/admin/banners/add", icon: FiPlusSquare, label: "Add Banner" },
        { href: "/admin/banners", icon: FiList, label: "Banners List" },
      ],
    },
    { href: "/admin/enquires", icon: FiPhone, label: "Enquiries" },
  ];

  // Flatten menu items for mobile bottom bar
  const flatMenuItems = menuItems.flatMap((item) =>
    item.section ? item.items : [item]
  );

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`group flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-radial-[at_95%_25%] from-amber-500 to-amber-700 to-75% text-white shadow-md"
            : "text-gray-700 hover:bg-gray-100 hover:text-amber-600"
        }`}
      >
        <Icon
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? "scale-110" : "group-hover:scale-110"
          }`}
        />
        <span className="font-medium text-sm">{item.label}</span>
      </Link>
    );
  };

  const renderMobileMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-linear-to-br from-amber-500 to-amber-700 text-white shadow-lg"
            : "text-gray-600 hover:text-amber-600 hover:bg-gray-50"
        }`}
      >
        <Icon
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? "scale-110" : ""
          }`}
        />
        <span className="text-[10px] font-medium leading-tight text-center">
          {item.label.split(" ")[0]}
        </span>
      </Link>
    );
  };

  const handleLogout = () => {
    alert("Logged Out Successfully");
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-xl border-r border-gray-200/50 h-screen sticky top-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 relative">
          {menuItems.map((item, index) => {
            // If item has a section (grouped items)
            if (item.section) {
              return (
                <div key={item.section} className="mb-4">
                  <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.section}
                  </h3>
                  <div className="space-y-1">{item.items.map(renderMenuItem)}</div>
                </div>
              );
            }
            // Single menu item
            return renderMenuItem(item);
          })}

          {/* Divider */}
          <div className="pt-4">
            <hr className="border-gray-200/50" />
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group w-full flex items-center cursor-pointer space-x-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 mt-2"
          >
            <FiLogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200/50 shadow-2xl z-40">
        <div className="flex items-center justify-around px-2 py-2 overflow-x-auto scrollbar-hide">
          {flatMenuItems.slice(0, 5).map(renderMobileMenuItem)}
          {flatMenuItems.length > 5 && (
            <button className="flex flex-col items-center justify-center gap-1 py-2 px-3 text-gray-600">
              <FiList className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          )}
        </div>
      </nav>

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full transform transition-all">
            <h2 className="text-xl font-medium mb-6 text-gray-900">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLogout()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;