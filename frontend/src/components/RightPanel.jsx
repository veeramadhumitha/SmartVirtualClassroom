// src/components/RightPanel.jsx

const RightPanel = () => {
  const stats = [
    { title: "Live Status", value: "No Live Class", bg: "bg-red-100", text: "text-red-600" },
    { title: "Students Online", value: "38", bg: "bg-blue-100", text: "text-blue-600" },
    { title: "Today's Sessions", value: "2", bg: "bg-purple-100", text: "text-purple-600" },
    { title: "Avg Attendance", value: "92%", bg: "bg-green-100", text: "text-green-600" },
  ];

  const activities = [
    "Live class started – DBMS (10:30 AM)",
    "Attendance auto-marked (92%)",
    "Test created – Unit 2",
    "Notes uploaded – OS.pdf",
  ];

  const upcoming = [
    { subject: "DBMS", time: "Today 2:00 PM" },
    { subject: "OS", time: "Tomorrow 10:00 AM" },
    { subject: "CN", time: "Friday 11:30 AM" },
  ];

  return (
    <div className="w-full lg:w-[35%] p-4 space-y-6">

      {/* TOP STATS */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 shadow ${item.bg}`}
          >
            <p className="text-sm text-gray-600">{item.title}</p>
            <h2 className={`text-xl font-bold ${item.text}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ACTIVITY FEED */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">📌 Recent Activity</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          {activities.map((act, i) => (
            <li
              key={i}
              className="border-l-4 border-blue-500 pl-3"
            >
              {act}
            </li>
          ))}
        </ul>
      </div>

      {/* UPCOMING CLASSES */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">📅 Upcoming Classes</h3>
        <ul className="space-y-2 text-sm">
          {upcoming.map((u, i) => (
            <li
              key={i}
              className="flex justify-between text-gray-600"
            >
              <span>{u.subject}</span>
              <span>{u.time}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="action-btn">➕ Create Test</button>
          <button className="action-btn">📢 Start Live</button>
          <button className="action-btn">📝 Upload Notes</button>
          <button className="action-btn">📊 Attendance</button>
        </div>
      </div>

      {/* SMART TIP */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl">
        🤖 <b>AI Insight:</b> Best engagement between <b>10–11 AM</b>.  
        Last class attendance was <b>92%</b>.
      </div>

    </div>
  );
};

export default RightPanel;