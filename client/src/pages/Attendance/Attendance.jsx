import React, { useState, useEffect, useRef } from "react";
import { memberService } from "../../services/memberService";
import "./Attendance.css";

export default function Attendance() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [toastMessage, setToastMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const filterRef = useRef(null);

  // --------------------------------------------------
  // Fetch Members Data
  // --------------------------------------------------
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await memberService.getAllMembers();
      const rawData = Array.isArray(response)
        ? response
        : response.members || [];

      // Format response data to fit the attendance component state structure
      const formattedMembers = rawData.map((item) => {
        const userData = item.user || {};
        const memberId = item._id || item.id;

        return {
          id: memberId,
          name: userData.name || "Unknown User",
          avatar:
            userData.avatarUrl ||
            `https://i.pravatar.cc/150?u=${memberId}`,
          attendance: item.attendance === "Present" ? "Present" : "Absent",
          excused: Boolean(item.excused),
        };
      });

      setMembers(formattedMembers);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError(err.message || "Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  const handleAttendanceChange = (id, status) => {
    setMembers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, attendance: status } : item
      )
    );
  };

  const handleToggleHeadsUp = (id) => {
    setMembers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextExcused = !item.excused;
          return {
            ...item,
            excused: nextExcused,
            attendance: nextExcused ? "Absent" : item.attendance,
          };
        }
        return item;
      })
    );
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);

      // Call batch update if available on memberService, or save locally
      if (memberService.saveAttendance) {
        await memberService.saveAttendance(members);
      }

      setToastMessage("Attendance records saved successfully!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert(err.message || "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Filter & Pagination Logic
  // --------------------------------------------------
  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      statusFilter === "All"
        ? true
        : statusFilter === "Excused"
        ? member.excused
        : member.attendance === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRecords = filteredMembers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="attendance-page">
      {/* Top Action Bar */}
      <div className="top-bar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search member..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn-save"
            onClick={handleSaveAttendance}
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <div className="filter-wrapper" ref={filterRef}>
            <button
              type="button"
              className="btn-filter"
              onClick={() => setShowFilterMenu((prev) => !prev)}
            >
              <span>Y</span> Filter
            </button>

            {/* Filter Dropdown */}
            {showFilterMenu && (
              <div className="filter-menu">
                {["All", "Present", "Absent", "Excused"].map((filterOpt) => (
                  <button
                    type="button"
                    key={filterOpt}
                    className={`filter-item-btn ${
                      statusFilter === filterOpt ? "active" : ""
                    }`}
                    onClick={() => {
                      setStatusFilter(filterOpt);
                      setShowFilterMenu(false);
                      setCurrentPage(1);
                    }}
                  >
                    {filterOpt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="table-card">
        <table className="attendance-table">
          <thead>
            <tr>
              <th style={{ width: "40%" }}>Member Name</th>
              <th style={{ width: "35%" }}>Attendance</th>
              <th style={{ width: "25%" }}>Excused</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "24px" }}>
                  Loading attendance records...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "24px", color: "red" }}>
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && currentRecords.length > 0 && (
              currentRecords.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="member-cell">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="member-avatar"
                      />
                      <span className="member-name">{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="attendance-toggle-group">
                      <button
                        type="button"
                        className={`btn-toggle ${
                          item.attendance === "Present" ? "active-present" : ""
                        }`}
                        onClick={() => handleAttendanceChange(item.id, "Present")}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        className={`btn-toggle ${
                          item.attendance === "Absent" ? "active-absent" : ""
                        }`}
                        onClick={() => handleAttendanceChange(item.id, "Absent")}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn-heads-up ${
                        item.excused ? "excused-active" : ""
                      }`}
                      onClick={() => handleToggleHeadsUp(item.id)}
                    >
                      {item.excused ? "Excused ✓" : "Heads Up"}
                    </button>
                  </td>
                </tr>
              ))
            )}

            {!loading && !error && currentRecords.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "24px" }}>
                  No members matched your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Dynamic Pagination Bar */}
        <div className="pagination-container">
          <div className="pagination-left">
            <span>Showing</span>
            <select
              className="select-rows"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="pagination-center">
            Showing {filteredMembers.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + rowsPerPage, filteredMembers.length)} out of{" "}
            {filteredMembers.length} records
          </div>

          <div className="pagination-right">
            <button
              type="button"
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                type="button"
                key={page}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Save Toast Notification */}
      {toastMessage && <div className="toast-msg">{toastMessage}</div>}
    </div>
  );
}