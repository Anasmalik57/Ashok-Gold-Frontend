"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { GoPackage } from "react-icons/go";
import { BiCategoryAlt } from "react-icons/bi";
import EnQuiriesListComponent from "./EnQuiriesListComponent";
import { API_BASE } from "@/lib/api";

// Dynamic import for ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AdminDashboard = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [activeBanners, setActiveBanners] = useState(0); // For bar chart
  const [inactiveBanners, setInactiveBanners] = useState(0);
  const [enquiries, setEnquiries] = useState([]); // For line chart & list (pass to child if needed)
  const [loading, setLoading] = useState(true); // Global loading
  const [error, setError] = useState(null);
  const [lineChartData, setLineChartData] = useState([]);

  // ============================================================================
  // =========================== Fetch Data From DB =============================
  // ============================================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parallel fetches for efficiency
      const [
        categoriesRes,
        productsRes,
        activeBannersRes,
        inactiveBannersRes,
        allEnquiriesRes,
      ] = await Promise.all([
        fetch(`${API_BASE}/categories`), // All categories
        fetch(`${API_BASE}/products`), // All products
        fetch(`${API_BASE}/banners?status=active`), // Active banners
        fetch(`${API_BASE}/banners?status=inactive`), // Inactive banners
        fetch(`${API_BASE}/enquiries`), // All enquiries for trend
      ]);

      if (
        !categoriesRes.ok ||
        !productsRes.ok ||
        !activeBannersRes.ok ||
        !inactiveBannersRes.ok ||
        !allEnquiriesRes.ok
      ) {
        throw new Error("One or more fetches failed");
      }

      const [
        categories,
        products,
        activeBannersData,
        inactiveBannersData,
        allEnquiries,
      ] = await Promise.all([
        categoriesRes.json(),
        productsRes.json(),
        activeBannersRes.json(),
        inactiveBannersRes.json(),
        allEnquiriesRes.json(),
      ]);

      // Set counts
      setCategoriesCount(categories.total || categories.data.length);
      setProductsCount(products.total || products.data.length);
      setActiveBanners(
        activeBannersData.total || activeBannersData.data.length
      );
      setInactiveBanners(
        inactiveBannersData.total || inactiveBannersData.data.length
      );

      // Map & set enquiries (for line chart & list)
      const mappedEnquiries = allEnquiries.data.map((enq) => ({
        id: enq._id,
        name: enq.enquirerName,
        phone: enq.phone,
        product: enq.productName,
        date: new Date(enq.dateOfEnquiry).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        fullDate: new Date(enq.dateOfEnquiry), // For week calc
      }));
      setEnquiries(mappedEnquiries);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardData();
  }, []); // Initial fetch on mount
  // =============================================================================
  useEffect(() => {
    if (enquiries.length > 0) {
      const now = new Date("2025-12-22"); // Current date from prompt
      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(now.getDate() - now.getDay()); // Monday start
      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(thisWeekStart.getDate() - 7);

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      const thisWeekCounts = new Array(7).fill(0);
      const lastWeekCounts = new Array(7).fill(0);

      enquiries.forEach((enq) => {
        const enqDate = enq.fullDate;
        const dayIndex = enqDate.getDay(); // 0=Sun, 1=Mon...

        if (
          enqDate >= thisWeekStart &&
          enqDate < new Date(thisWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
        ) {
          thisWeekCounts[dayIndex]++; // Adjust if Mon=0
        } else if (
          enqDate >= lastWeekStart &&
          enqDate < new Date(lastWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
        ) {
          lastWeekCounts[dayIndex]++;
        }
      });

      const computedData = days.map((day, idx) => ({
        day,
        thisWeek: thisWeekCounts[(idx + 1) % 7], // Adjust index if needed (Mon=0)
        lastWeek: lastWeekCounts[(idx + 1) % 7],
      }));
      setLineChartData(computedData);
    }
  }, [enquiries]);

  // ============================================================================

  // ApexCharts Line Chart Configuration
  const lineChartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    colors: ["#10b981", "#3b82f6"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: lineChartData.map((d) => d.day),
      labels: { style: { colors: "#9ca3af", fontSize: "10px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      markers: { width: 8, height: 8, radius: 12 },
    },
    tooltip: {
      theme: "light",
      style: { fontSize: "12px" },
      y: { formatter: (val) => val + " inquiries" },
    },
  };

  const lineChartSeries = [
    { name: "This Week", data: lineChartData.map((d) => d.thisWeek) },
    { name: "Last Week", data: lineChartData.map((d) => d.lastWeek) },
  ];

  // ApexCharts Bar Chart Configuration
  const barChartOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
        distributed: true,
      },
    },
    colors: ["#3b82f6", "#ef4444"],
    dataLabels: { enabled: true },
    xaxis: {
      categories: ["Active", "Inactive"],
      labels: { style: { colors: "#9ca3af", fontSize: "10px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: true },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    tooltip: {
      theme: "light",
      style: { fontSize: "12px" },
      y: { formatter: (val) => val + " banners" },
    },
  };

  const barChartSeries = [
    { name: "Banners", data: [activeBanners, inactiveBanners] },
  ]; // Fetched counts

  if (loading) {
    return (
      <main className="flex-1 p-3 sm:p-4 md:p-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen overflow-auto flex items-center justify-center">
        <div className="text-center text-gray-500">Loading dashboard...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-3 sm:p-4 md:p-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen overflow-auto flex items-center justify-center">
        <div className="text-center text-red-500">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-3 sm:p-4 md:p-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen overflow-auto">
      {/* Welcome Section */}
      <section className="mb-4 sm:mb-6 md:mb-8 relative">
        <div
          className="relative bg-cover bg-center rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 flex items-center space-x-3 sm:space-x-4 md:space-x-6 shadow-xl overflow-hidden"
          style={{
            backgroundImage: "url('/adminbannerimage.png')",
            minHeight: "100px",
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <img
            src="/avatar.png"
            alt="Admin Profile"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white/30 shadow-lg relative z-10 shrink-0"
          />
          <div className="relative z-10 text-white">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1 leading-tight">
              Welcome Back, Admin!
            </h1>
            <p className="text-xs sm:text-sm md:text-base opacity-90">
              Manage your gold store smoothly & securely.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Stats & Charts */}
      <section className="flex h-fit gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8 flex-wrap">
        {/* Total Categories Card */}
        <div className="flex-1 min-w-50 bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                Total Categories
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {categoriesCount}
              </p>
            </div>
            <div className="p-2 sm:p-2.5 bg-linear-to-br from-red-400 to-red-500 rounded-lg">
              <BiCategoryAlt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="flex-1 min-w-50 bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                Total Products
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {productsCount}+
              </p>
            </div>
            <div className="p-2 sm:p-2.5 bg-linear-to-br from-blue-400 to-blue-500 rounded-lg">
              <GoPackage className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Banners Status Chart Card */}
        <div className="flex-1 min-w-62.5 bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Banners Status
          </h3>
          <div className="h-32 sm:h-40">
            {isMounted && (
              <Chart
                options={barChartOptions}
                series={barChartSeries}
                type="bar"
                height="100%"
              />
            )}
          </div>
        </div>

        {/* Inquiries Trend Chart Card */}
        <div className="flex-1 w-full sm:col-span-2 bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Inquiries Trend
          </h3>
          <div className="h-40 sm:h-48 md:h-40">
            {isMounted && (
              <Chart
                options={lineChartOptions}
                series={lineChartSeries}
                type="area"
                height="100%"
              />
            )}
          </div>
        </div>
      </section>

      <EnQuiriesListComponent />
    </main>
  );
};

export default AdminDashboard;
