import React, { useState } from "react";
import "./Dashboard.css";

// Initial mock dataset for sessions mapped by date string (YYYY-MM-DD)
const initialSessionsData = {
  "2025-07-06": [
    {
      time: "09:30",
      category: "CPD",
      name: "Contest in CPD Division",
    },
    {
      time: "12:00",
      category: "Development Division",
      name: "Development Weekly Sessions",
    },
    {
      time: "01:30",
      category: "Cyber",
      name: "Cyber Weekly Sessions",
    },
  ],

  "2025-07-07": [
    {
      time: "09:30",
      category: "Data Science",
      name: "Data Science Weekly Sessions",
    },
    {
      time: "11:00",
      category: "CPD",
      name: "Contest Analysis in CPD Division",
    },
  ],

  "2025-07-08": [
    {
      time: "10:00",
      category: "Design",
      name: "UI/UX Design Workshop",
    },
  ],
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Attendance Overview");

  const [currentDate, setCurrentDate] = useState(
    new Date(2025, 6, 6)
  );

  const [selectedDay, setSelectedDay] = useState(6);

  const [addedToCalendar, setAddedToCalendar] = useState(false);

  const [sessions] = useState(initialSessionsData);

  const stats = [
    {
      title: "Total Members",
      value: "162",
      trend: "12%",
      trendType: "up",
      update: "July 16, 2025",
      icon: "👥",
    },
    {
      title: "Total Divisions",
      value: "5",
      trend: "5%",
      trendType: "up",
      update: "July 14, 2025",
      icon: "🥞",
    },
    {
      title: "Attendance Rate",
      value: "68%",
      trend: "8%",
      trendType: "down",
      update: "July 14, 2025",
      icon: "📅",
    },
    {
      title: "Upcoming Sessions",
      value: "12",
      trend: "12%",
      trendType: "up",
      update: "July 10, 2025",
      icon: "🕒",
    },
  ];

  // Calendar information
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDayIndex = new Date(year, month, 1).getDay();

  // Previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  // Next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  // Select calendar day
  const handleSelectDay = (day) => {
    setSelectedDay(day);
  };

  // Add event to calendar
  const handleAddCalendar = () => {
    setAddedToCalendar(true);

    setTimeout(() => {
      setAddedToCalendar(false);
    }, 2500);
  };

  // Selected date key
  const formattedMonth = String(month + 1).padStart(2, "0");
  const formattedDay = String(selectedDay).padStart(2, "0");

  const selectedDateKey = `${year}-${formattedMonth}-${formattedDay}`;

  const currentSelectedSessions =
    sessions[selectedDateKey] || [];

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* Main Content */}
        <div className="main-content">
          {/* Banner Card */}
          <div className="banner-card">
            <div>
              <div className="banner-title">Members</div>

              <div className="banner-subtitle">
                Upcoming Event
              </div>

              <div className="banner-description">
                Cross-division knowledge-sharing
              </div>
            </div>

            <button
              type="button"
              className="btn-calendar"
              onClick={handleAddCalendar}
            >
              {addedToCalendar
                ? "✓ Added to Calendar"
                : "Add to calendar"}
            </button>
          </div>

          {/* Stat Cards */}
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.title} className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon">
                    {stat.icon}
                  </div>

                  <span className="stat-label">
                    {stat.title}
                  </span>
                </div>

                <div className="stat-body">
                  <span className="stat-value">
                    {stat.value}
                  </span>

                  <span
                    className={`trend-badge ${
                      stat.trendType === "up"
                        ? "trend-up"
                        : "trend-down"
                    }`}
                  >
                    {stat.trendType === "up" ? "▲" : "▼"}{" "}
                    {stat.trend}
                  </span>
                </div>

                <div className="stat-footer">
                  Update: {stat.update}
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Chart */}
          <div className="analytics-card">
            <div className="analytics-header">
              <div className="tabs">
                {[
                  "Attendance Overview",
                  "Total Members",
                  "Total Event",
                ].map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    className={`tab-btn ${
                      activeTab === tab ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="legend">
                <div className="legend-item">
                  <span
                    className="dot"
                    style={{
                      backgroundColor: "#1e293b",
                    }}
                  />

                  <span>This year</span>
                </div>

                <div className="legend-item">
                  <span
                    className="dot"
                    style={{
                      backgroundColor: "#3b82f6",
                    }}
                  />

                  <span>Last year</span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-area">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 500 150"
                preserveAspectRatio="none"
              >
                {activeTab === "Attendance Overview" && (
                  <>
                    <path
                      d="M 10 130 Q 60 40 100 100 T 200 130 T 300 70 T 400 60 T 480 20"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    <path
                      d="M 10 100 Q 50 140 100 120 T 200 40 T 300 100 T 400 90 T 480 80"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="2"
                    />
                  </>
                )}

                {activeTab === "Total Members" && (
                  <>
                    <path
                      d="M 10 110 Q 80 80 150 90 T 300 40 T 480 30"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    <path
                      d="M 10 130 Q 100 100 200 60 T 350 50 T 480 10"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="2"
                    />
                  </>
                )}

                {activeTab === "Total Event" && (
                  <>
                    <path
                      d="M 10 90 Q 120 120 220 80 T 380 90 T 480 40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    <path
                      d="M 10 120 Q 90 60 180 110 T 320 30 T 480 60"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "#94a3b8",
                  paddingTop: "8px",
                }}
              >
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Sidebar */}
        <div className="sidebar-content">
          {/* Session Header */}
          <div className="session-header">
            <h2 className="session-title">
              Session
            </h2>

            <button
              type="button"
              className="icon-calendar-btn"
              title="View Full Calendar"
            >
              📅
            </button>
          </div>

          {/* Calendar */}
          <div className="calendar-widget">
            <div className="calendar-nav">
              <button
                type="button"
                className="nav-arrow"
                onClick={handlePrevMonth}
              >
                ‹
              </button>

              <span className="calendar-month">
                {monthName}, {year}
              </span>

              <button
                type="button"
                className="nav-arrow"
                onClick={handleNextMonth}
              >
                ›
              </button>
            </div>

            <div className="calendar-grid">
              {[
                "Su",
                "Mo",
                "Tu",
                "We",
                "Th",
                "Fr",
                "Sa",
              ].map((dayName) => (
                <div
                  key={dayName}
                  className="day-name"
                >
                  {dayName}
                </div>
              ))}

              {/* Empty cells */}
              {Array.from({
                length: firstDayIndex,
              }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                />
              ))}

              {/* Days */}
              {Array.from(
                { length: daysInMonth },
                (_, index) => index + 1
              ).map((day) => {
                const isSelected =
                  selectedDay === day;

                return (
                  <div
                    key={day}
                    className={`day-number ${
                      isSelected
                        ? "selected-blue"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectDay(day)
                    }
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule */}
          <div className="schedule-group">
            <div className="schedule-date-header">
              <span>
                {new Date(
                  year,
                  month,
                  selectedDay
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <span
                style={{
                  cursor: "pointer",
                }}
              >
                ⋮
              </span>
            </div>

            {currentSelectedSessions.length > 0 ? (
              currentSelectedSessions.map(
                (item, index) => (
                  <div
                    className="schedule-item"
                    key={`${item.time}-${index}`}
                  >
                    <span className="schedule-time">
                      {item.time}
                    </span>

                    <div className="schedule-details">
                      <div className="schedule-category">
                        {item.category}
                      </div>

                      <p className="schedule-name">
                        {item.name}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontStyle: "italic",
                  margin: "8px 0",
                }}
              >
                No scheduled sessions for this
                date.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}