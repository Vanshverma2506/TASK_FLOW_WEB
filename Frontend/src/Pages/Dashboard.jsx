import { useEffect, useState } from "react";
import API from "../api/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/tasks/stats");
      setStats(res.data.data);
    };
    fetch();
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center mt-20">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Tasks",
      value: stats.total,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Completed",
      value: stats.completed,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Pending",
      value: stats.pending,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Overdue ⚠️",
      value: stats.overdue,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="space-y-6">

      
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard 📊
        </h1>
        <p className="text-sm text-gray-500">
          Overview of your tasks & performance
        </p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <p className="text-gray-500 text-sm">{card.label}</p>

            <h2
              className={`text-3xl font-bold mt-2 ${card.color}`}
            >
              {card.value}
            </h2>
          </div>
        ))}

      </div>

      
      <div className="bg-white p-5 rounded-xl shadow">

        <h2 className="font-semibold text-lg mb-3">
          Insights 💡
        </h2>

        <ul className="text-sm text-gray-600 space-y-2">

          {stats.overdue > 0 && (
            <li className="text-red-500">
              ⚠️ You have {stats.overdue} overdue tasks
            </li>
          )}

          {stats.pending > 0 && (
            <li>
              📌 {stats.pending} tasks are still pending
            </li>
          )}

          {stats.completed > 0 && (
            <li className="text-green-600">
              ✅ Great! {stats.completed} tasks completed
            </li>
          )}

          {stats.overdue === 0 && (
            <li className="text-green-600">
              🎉 No overdue tasks — good job!
            </li>
          )}

        </ul>

      </div>

    </div>
  );
};

export default Dashboard;