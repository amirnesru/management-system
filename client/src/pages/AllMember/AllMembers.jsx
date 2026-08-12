import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permissions";
import { memberService } from "../../services/memberService";
import "./AllMembers.css";

export default function AllMembers() {
  const { user } = useAuth();

  // Permissions
  const canEdit =
    user?.role === "Admin" ||
    hasPermission(user?.role, "canUpdateMember") ||
    hasPermission(user?.role, "canEditMember");
  const canDelete =
    user?.role === "Admin" || hasPermission(user?.role, "canDeleteMember");
  const canAdd =
    user?.role === "Admin" ||
    hasPermission(user?.role, "canCreateMember") ||
    hasPermission(user?.role, "canAddMember");
  const canPerformActions = canEdit || canDelete;

  // State
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const filterRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [formData, setFormData] = useState({
    user: "",
    name: "",
    memberId: "",
    division: "Design",
    year: "1st",
    status: "On Campus",
    role: "User",
  });

  // Fetch Members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await memberService.getAllMembers();
      const data = Array.isArray(response) ? response : response.members || [];
      setMembers(data);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError(err.message || "Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await memberService.getAllUsers();
      const data = Array.isArray(response) ? response : response.users || [];
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      alert(err.message || "Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Close filter on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Badge Class Helpers
  const getAttendanceClass = (status) => {
    if (status === "Active") return "badge badge-active";
    if (status === "Needs Attention") return "badge badge-needs-attention";
    return "badge badge-inactive";
  };

  const getStatusClass = (status) => {
    if (status === "On Campus") return "badge badge-on-campus";
    if (status === "Off Campus") return "badge badge-off-campus";
    return "badge badge-withdrawn";
  };

  // Filter Logic
  const filteredMembers = members.filter((member) => {
    const search = searchTerm.toLowerCase();
    const name =
      member.name?.toLowerCase() || member.user?.name?.toLowerCase() || "";
    const email =
      member.email?.toLowerCase() || member.user?.email?.toLowerCase() || "";
    const memberId = member.memberId?.toLowerCase() || "";
    const division = member.division || member.user?.division || "";

    const matchesSearch =
      name.includes(search) ||
      email.includes(search) ||
      memberId.includes(search);
    const matchesDivision =
      selectedDivision === "All" || division === selectedDivision;

    return matchesSearch && matchesDivision;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentMembers = filteredMembers.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  // Modal Triggers
  const handleOpenAddModal = async () => {
    setEditingMemberId(null);
    setFormData({
      user: "",
      name: "",
      memberId: "",
      division: "Design",
      year: "1st",
      status: "On Campus",
      role: "User",
    });
    setIsModalOpen(true);
    await fetchUsers();
  };

  const handleOpenEditModal = (member) => {
    setEditingMemberId(member._id);
    setFormData({
      user: member.userId || member.user?._id || "",
      name: member.name || member.user?.name || "",
      memberId: member.memberId || "",
      division: member.division || member.user?.division || "Design",
      year: member.year || member.user?.year || "1st",
      status: member.status || "On Campus",
      role: member.role || member.user?.role || "User",
    });
    setIsModalOpen(true);
  };

  // User Selection Handler
  const handleUserChange = (event) => {
    const selectedUserId = event.target.value;
    const selectedUser = users.find((item) => item._id === selectedUserId);

    if (!selectedUser) {
      setFormData((prev) => ({ ...prev, user: "", name: "" }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      user: selectedUser._id,
      name: selectedUser.name || "",
      division: selectedUser.division || "Design",
      year: selectedUser.year || "1st",
      role: selectedUser.role || "User",
    }));
  };

  // Delete Handler
  const handleDeleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await memberService.deleteMember(id);
      setMembers((prev) => prev.filter((member) => member._id !== id));
      setCurrentPage((page) => {
        const remaining = filteredMembers.length - 1;
        const newTotalPages = Math.ceil(remaining / rowsPerPage) || 1;
        return Math.min(page, newTotalPages);
      });
    } catch (err) {
      console.error("Delete member error:", err);
      alert(err.message || "Failed to delete member.");
    }
  };

  // Submit Handler
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!formData.memberId.trim()) {
      alert("Member ID is required.");
      return;
    }
    if (!editingMemberId && !formData.user) {
      alert("Please select a user.");
      return;
    }

    try {
      if (editingMemberId) {
        const updateData = {
          user: formData.user,
          memberId: formData.memberId,
          status: formData.status,
          name: formData.name,
          role: formData.role,
          division: formData.division,
          year: formData.year,
        };

        const response = await memberService.updateMember(
          editingMemberId,
          updateData,
        );
        const updatedMember = response.member || response;

        setMembers((prev) =>
          prev.map((member) =>
            member._id === editingMemberId
              ? {
                  ...updatedMember,
                  name:
                    updatedMember.user?.name ||
                    updatedMember.name ||
                    formData.name,
                  email:
                    updatedMember.user?.email || updatedMember.email || "",
                  role:
                    updatedMember.user?.role ||
                    updatedMember.role ||
                    formData.role,
                  division:
                    updatedMember.user?.division ||
                    updatedMember.division ||
                    formData.division,
                  year:
                    updatedMember.user?.year ||
                    updatedMember.year ||
                    formData.year,
                  userId: updatedMember.user?._id || formData.user,
                }
              : member,
          ),
        );
      } else {
        const response = await memberService.createMember({
          user: formData.user,
          memberId: formData.memberId,
          status: formData.status,
        });

        const createdMember = response.member || response;
        const formattedMember = {
          ...createdMember,
          name: createdMember.user?.name || formData.name,
          email: createdMember.user?.email || "",
          role: createdMember.user?.role || formData.role,
          division: createdMember.user?.division || formData.division,
          year: createdMember.user?.year || formData.year,
          userId: createdMember.user?._id || formData.user,
        };

        setMembers((prev) => [formattedMember, ...prev]);
      }

      setIsModalOpen(false);
      setEditingMemberId(null);
      setFormData({
        user: "",
        name: "",
        memberId: "",
        division: "Design",
        year: "1st",
        status: "On Campus",
        role: "User",
      });
      setCurrentPage(1);
    } catch (err) {
      console.error("Save member error:", err);
      alert(err.message || "Failed to save member.");
    }
  };

  return (
    <div className="all-members-container">
      {/* Header & Controls */}
      <div className="members-header">
        <div className="search-container">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search member name or ID..."
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
          {canAdd && (
            <button
              type="button"
              className="btn-add-member"
              onClick={handleOpenAddModal}
            >
              <span className="btn-icon">+</span>
              Add Member
            </button>
          )}

          <div className="filter-wrapper" ref={filterRef}>
            <button
              type="button"
              className={`btn-filter ${selectedDivision !== "All" ? "active-filter" : ""}`}
              onClick={() => setShowFilterDropdown((prev) => !prev)}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Division:</span>
              <strong>{selectedDivision}</strong>
              <span className="chevron-icon">
                {showFilterDropdown ? "▲" : "▼"}
              </span>
            </button>

            {showFilterDropdown && (
              <div className="filter-dropdown-menu">
                <div className="filter-dropdown-header">Filter by Division</div>
                {[
                  "All",
                  "Design",
                  "Development",
                  "CPD",
                  "Cyber",
                  "CSEC ASTU",
                ].map((division) => (
                  <button
                    type="button"
                    key={division}
                    className={`filter-option ${selectedDivision === division ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedDivision(division);
                      setShowFilterDropdown(false);
                      setCurrentPage(1);
                    }}
                  >
                    {division}
                    {selectedDivision === division && (
                      <span className="check-mark">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="table-card">
        <table className="members-table">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Member ID</th>
              <th>Division</th>
              <th>Role</th>
              <th>Attendance</th>
              <th>Year</th>
              <th>Status</th>
              {canPerformActions && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={canPerformActions ? 8 : 7}
                  style={{ textAlign: "center", padding: "24px" }}
                >
                  Loading members...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={canPerformActions ? 8 : 7}
                  style={{ textAlign: "center", padding: "24px", color: "red" }}
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              currentMembers.length > 0 &&
              currentMembers.map((member) => {
                const memberKey = member._id;
                const memberName =
                  member.name || member.user?.name || "Unknown User";
                const memberDivision =
                  member.division || member.user?.division || "";
                const memberRole = member.role || member.user?.role || "User";
                const memberYear = member.year || member.user?.year || "—";
                const memberAvatar =
                  member.avatarUrl || member.user?.avatarUrl;

                return (
                  <tr key={memberKey}>
                    <td>
                      <div className="member-cell">
                        <img
                          src={
                            memberAvatar ||
                            `https://i.pravatar.cc/150?u=${memberKey}`
                          }
                          alt={memberName}
                          className="member-avatar"
                        />
                        <span className="member-name">{memberName}</span>
                      </div>
                    </td>
                    <td className="member-id">{member.memberId}</td>
                    <td className="member-division">{memberDivision || "—"}</td>
                    <td
                      className="member-role"
                      style={{ textTransform: "capitalize" }}
                    >
                      {memberRole}
                    </td>
                    <td>
                      <span
                        className={getAttendanceClass(
                          member.attendance || "Inactive",
                        )}
                      >
                        {member.attendance || "Inactive"}
                      </span>
                    </td>
                    <td className="member-year">{memberYear}</td>
                    <td>
                      <span className={getStatusClass(member.status)}>
                        {member.status}
                      </span>
                    </td>
                    {canPerformActions && (
                      <td>
                        <div className="action-cell">
                          {canEdit && (
                            <button
                              type="button"
                              className="icon-btn"
                              title="Edit Member"
                              onClick={() => handleOpenEditModal(member)}
                            >
                              ✏️
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="icon-btn"
                              title="Delete Member"
                              onClick={() => handleDeleteMember(memberKey)}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}

            {!loading && !error && currentMembers.length === 0 && (
              <tr>
                <td
                  colSpan={canPerformActions ? 8 : 7}
                  style={{ textAlign: "center", padding: "24px" }}
                >
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
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
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  type="button"
                  key={page}
                  className={`page-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ),
            )}
            <button
              type="button"
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{editingMemberId ? "Edit Member" : "Add New Member"}</h3>
            <form onSubmit={handleFormSubmit} className="modal-form">
              {!editingMemberId && (
                <div>
                  <label>Select User</label>
                  <select
                    value={formData.user}
                    onChange={handleUserChange}
                    required
                    disabled={loadingUsers}
                  >
                    <option value="">
                      {loadingUsers ? "Loading users..." : "Select a user"}
                    </option>
                    {users
                      .filter(
                        (item) =>
                          !members.some((member) => member.userId === item._id),
                      )
                      .map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name || "Unnamed User"} —{" "}
                          {item.email || "No email"}
                        </option>
                      ))}
                  </select>
                  {!loadingUsers &&
                    users.filter(
                      (item) =>
                        !members.some((member) => member.userId === item._id),
                    ).length === 0 && <small>No available users to add.</small>}
                </div>
              )}

              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Member ID</label>
                <input
                  type="text"
                  required
                  value={formData.memberId}
                  onChange={(e) =>
                    setFormData({ ...formData, memberId: e.target.value })
                  }
                />
              </div>

              <div>
                <label>System Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="User">User</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label>Division</label>
                <select
                  value={formData.division}
                  onChange={(e) =>
                    setFormData({ ...formData, division: e.target.value })
                  }
                >
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="CPD">CPD</option>
                  <option value="Cyber">Cyber</option>
                  <option value="CSEC ASTU">CSEC ASTU</option>
                </select>
              </div>

              <div>
                <label>Academic Year</label>
                <select
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                >
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                  <option value="5th">5th</option>
                </select>
              </div>

              <div>
                <label>Campus Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="On Campus">On Campus</option>
                  <option value="Off Campus">Off Campus</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={!editingMemberId && loadingUsers}
                >
                  {editingMemberId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}