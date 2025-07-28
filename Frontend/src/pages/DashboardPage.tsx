import { useEffect, useState } from "react";
import apiClient from "../services/apiClient.ts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Activity {
  bookTitle: string;
  readerName: string;
  lendDate: string;
  dueDate: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeReaders: 0,
    lentBooks: 0,
    recentActivity: [] as Activity[],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get("/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };

    fetchDashboard();
  }, []);

  const chartData = [
    { name: "Books", value: stats.totalBooks },
    { name: "Readers", value: stats.activeReaders },
    { name: "Lent", value: stats.lentBooks },
  ];

  return (
      <div className="p-5 bg-gray-100 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 p-5">📊 Dashboard Overview</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-200 hover:bg-blue-300 transition p-5 rounded-2xl shadow">
              <p className="text-lg font-semibold text-blue-900">📚 Total Books</p>
              <p className="text-2xl font-bold">{stats.totalBooks}</p>
            </div>
            <div className="bg-green-200 hover:bg-green-300 transition p-5 rounded-2xl shadow">
              <p className="text-lg font-semibold text-green-900">👥 Active Readers</p>
              <p className="text-2xl font-bold">{stats.activeReaders}</p>
            </div>
            <div className="bg-yellow-200 hover:bg-yellow-300 transition p-5 rounded-2xl shadow">
              <p className="text-lg font-semibold text-yellow-900">📕 Books Lent</p>
              <p className="text-2xl font-bold">{stats.lentBooks}</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">📈 Lending Summary Chart</h2>
            <div className="h-64 bg-white rounded-lg shadow p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-2">🕘 Recent Lending Activity</h2>
            <ul className="space-y-3">
              {stats.recentActivity.map((item, index) => (
                  <li key={index} className="border border-gray-300 p-4 rounded-md bg-white shadow-sm">
                    <p className="text-md font-medium">
                      📘 <span className="text-blue-800">{item.bookTitle}</span> → 👤{" "}
                      <span className="text-gray-700">{item.readerName}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      🗓️ Lend: {new Date(item.lendDate).toLocaleDateString()} | Due:{" "}
                      {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
