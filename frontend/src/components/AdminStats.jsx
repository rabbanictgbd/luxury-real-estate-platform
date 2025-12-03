import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { FaUserAlt, FaMoneyBillWave, FaHeartbeat } from "react-icons/fa";

const AdminStats = () => {
  const { serverApi } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunds: 0,
    totalRequests: 0,
  });

useEffect(() => {
  const fetchStats = async () => {
    try {
      // Users count
      const resUsers = await fetch(`${serverApi}/api/users/count`);
      const dataUsers = await resUsers.json();

      // Funds total
      const resFunds = await fetch(`${serverApi}/api/funds`);
      const dataFunds = await resFunds.json();

      // Requests count
      const resRequests = await fetch(`${serverApi}/api/requests/count`);
      const dataRequests = await resRequests.json();

      setStats({
        totalUsers: dataUsers.totalUsers || 0,
        totalFunds: dataFunds.totalFunds || 0,
        totalRequests: dataRequests.totalRequests || 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  fetchStats();
}, [serverApi]);


  const cardData = [
    {
      title: "Total Users",
      count: stats.totalUsers,
      icon: <FaUserAlt size={28} className="text-red-600" />,
      bg: "bg-red-100",
    },
    {
      title: "Total Funds",
      count: `$${stats.totalFunds}`,
      icon: <FaMoneyBillWave size={28} className="text-green-600" />,
      bg: "bg-green-100",
    },
    {
      title: "Blood Donation Requests",
      count: stats.totalRequests,
      icon: <FaHeartbeat size={28} className="text-blue-600" />,
      bg: "bg-blue-100",
    },
  ];

  return (
    <div className=" grid md:grid-cols-3 gap-6 my-9">
      {cardData.map((card) => (
        <div
          key={card.title}
          className={`flex items-center p-5 rounded-lg shadow-lg ${card.bg}`}
        >
          <div className="p-3 rounded-full bg-white mr-4">{card.icon}</div>
          <div>
            <h3 className="text-2xl font-bold">{card.count}</h3>
            <p className="text-gray-700">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
