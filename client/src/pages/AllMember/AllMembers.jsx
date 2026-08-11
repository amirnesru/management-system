import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permissions";
import { memberService } from "../../services/memberService";
import "./AllMembers.css";

export default function AllMembers() {
  const { user } = useAuth();

  const canEdit = hasPermission(user?.role, "canUpdateMember");
  const canDelete = hasPermission(user?.role, "canDeleteMember");
  const canAdd = hasPermission(user?.role, "canCreateMember");

  const canPerformActions = canEdit || canDelete;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filterRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    memberId: "",
    division: "Design",
    year: "1st",
    status: "On Campus",
    role: "User",
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await memberService.getAllMembers();

      const data = Array.isArray(response)
        ? response
        : response.members || [];

      setMembers(data);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError(err.message || "Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const getAttendanceClass = (status) => {
    if (status === "Active") {
      return "badge badge-active";
    }

    if (status === "Needs Attention") {
      return "badge badge-needs-attention";
    }

    return "badge badge-inactive";
  };

  const getStatusClass = (status) => {
    if (status === "On Campus") {
      return "badge badge-on-campus";
    }

    if (status === "Off Campus") {
      return "badge badge-off-campus";
    }

    return "badge badge-withdrawn";
  };

  const filteredMembers = members.filter((member) => {
    const search = searchTerm.toLowerCase();

    const name =
      member.user?.name?.toLowerCase() || "";

    const email =
      member.user?.email?.toLowerCase() || "";

    const memberId =
      member.memberId?.toLowerCase() || "";

    const division =
      member.user?.division || "";

    const matchesSearch =
      name.includes(search) ||
      email.includes(search) ||
      memberId.includes(search);

    const matchesDivision =
      selectedDivision === "All" ||
      division === selectedDivision;

    return matchesSearch && matchesDivision;
  });

  const totalPages =
    Math.ceil(filteredMembers.length / rowsPerPage) || 1;

  const startIndex =
    (currentPage - 1) * rowsPerPage;

  const currentMembers = filteredMembers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleOpenAddModal = () => {
    setEditingMemberId(null);

    setFormData({
      name: "",
      memberId: "",
      division: "Design",
      year: "1st",
      status: "On Campus",
      role: "User",
    });

    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setEditingMemberId(member._id);

    setFormData({
      name: member.user?.name || "",
      memberId: member.memberId || "",
      division: member.user?.division || "Design",
      year: member.user?.year || "1st",
      status: member.status || "On Campus",
      role: member.user?.role || "User",
    });

    setIsModalOpen(true);
  };

  const handleDeleteMember = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await memberService.deleteMember(id);

      setMembers((prevMembers) =>
        prevMembers.filter(
          (member) => member._id !== id
        )
      );

      setCurrentPage((page) => {
        const remaining =
          filteredMembers.length - 1;

        const newTotalPages =
          Math.ceil(remaining / rowsPerPage) || 1;

        return Math.min(page, newTotalPages);
      });
    } catch (err) {
      console.error("Delete member error:", err);

      alert(
        err.message || "Failed to delete member."
      );
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.memberId.trim()
    ) {
      alert("Name and Member ID are required.");
      return;
    }

    try {
      if (editingMemberId) {
        const existingMember = members.find(
          (member) => member._id === editingMemberId
        );

        if (!existingMember) {
          throw new Error("Member not found.");
        }

        const updateData = {
          user: existingMember.user?._id,
          memberId: formData.memberId,
          status: formData.status,
          name: formData.name,
          role: formData.role,
          division: formData.division,
          year: formData.year,
        };

        const response =
          await memberService.updateMember(
            editingMemberId,
            updateData
          );

        const updatedMember =
          response.member || response;

        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member._id === editingMemberId
              ? updatedMember
              : member
          )
        );
      }

      else {
        if (!formData.user) {
          alert(
            "A User ID is required to create a member with the current backend."
          );
          return;
        }

        const response =
          await memberService.createMember({
            user: formData.user,
            memberId: formData.memberId,
            status: formData.status,
          });

        const createdMember =
          response.member || response;

        setMembers((prevMembers) => [
          createdMember,
          ...prevMembers,
        ]);
      }

      setIsModalOpen(false);
      setEditingMemberId(null);

      setCurrentPage(1);
    } catch (err) {
      console.error("Save member error:", err);

      alert(
        err.message || "Failed to save member."
      );
    }
  };

  return (
    <div className="all-members-container">

      <div className="members-header">

        <div className="search-container">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            className="search-input"
            placeholder="Search member name or ID..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
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

          <div
            className="filter-wrapper"
            ref={filterRef}
          >
            <button
              type="button"
              className={`btn-filter ${
                selectedDivision !== "All"
                  ? "active-filter"
                  : ""
              }`}
              onClick={() =>
                setShowFilterDropdown(
                  (prev) => !prev
                )
              }
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

              <strong>
                {selectedDivision}
              </strong>

              <span className="chevron-icon">
                {showFilterDropdown
                  ? "▲"
                  : "▼"}
              </span>
            </button>

            {showFilterDropdown && (
              <div className="filter-dropdown-menu">

                <div className="filter-dropdown-header">
                  Filter by Division
                </div>

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
                    className={`filter-option ${
                      selectedDivision === division
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedDivision(
                        division
                      );
                      setShowFilterDropdown(false);
                      setCurrentPage(1);
                    }}
                  >
                    {division}

                    {selectedDivision ===
                      division && (
                      <span className="check-mark">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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

              {canPerformActions && (
                <th>Action</th>
              )}
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td
                  colSpan={
                    canPerformActions ? 8 : 7
                  }
                  style={{
                    textAlign: "center",
                    padding: "24px",
                  }}
                >
                  Loading members...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={
                    canPerformActions ? 8 : 7
                  }
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "red",
                  }}
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              currentMembers.length > 0 &&
              currentMembers.map((member) => {

                const memberId =
                  member._id;

                const userData =
                  member.user || {};

                return (
                  <tr key={memberId}>

                    <td>
                      <div className="member-cell">

                        <img
                          src={
                            userData.avatarUrl ||
                            `https://i.pravatar.cc/150?u=${memberId}`
                          }
                          alt={
                            userData.name ||
                            "Member"
                          }
                          className="member-avatar"
                        />

                        <span className="member-name">
                          {userData.name ||
                            "Unknown User"}
                        </span>
                      </div>
                    </td>

                    <td className="member-id">
                      {member.memberId}
                    </td>

                    <td className="member-division">
                      {userData.division ||
                        "—"}
                    </td>

                    <td
                      className="member-role"
                      style={{
                        textTransform:
                          "capitalize",
                      }}
                    >
                      {userData.role ||
                        "User"}
                    </td>

                    <td>
                      <span
                        className={getAttendanceClass(
                          member.attendance ||
                            "Inactive"
                        )}
                      >
                        {member.attendance ||
                          "Inactive"}
                      </span>
                    </td>

                    <td className="member-year">
                      {userData.year ||
                        "—"}
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          member.status
                        )}
                      >
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
                              onClick={() =>
                                handleOpenEditModal(
                                  member
                                )
                              }
                            >
                              ✏️
                            </button>
                          )}

                          {canDelete && (
                            <button
                              type="button"
                              className="icon-btn"
                              title="Delete Member"
                              onClick={() =>
                                handleDeleteMember(
                                  memberId
                                )
                              }
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

            {!loading &&
              !error &&
              currentMembers.length === 0 && (
                <tr>
                  <td
                    colSpan={
                      canPerformActions ? 8 : 7
                    }
                    style={{
                      textAlign: "center",
                      padding: "24px",
                    }}
                  >
                    No members found.
                  </td>
                </tr>
              )}

          </tbody>
        </table>

        <div className="pagination-container">

          <div className="pagination-left">
            <span>Showing</span>

            <select
              className="select-rows"
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(
                  Number(event.target.value)
                );
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="pagination-center">
            Showing{" "}
            {filteredMembers.length > 0
              ? startIndex + 1
              : 0}{" "}
            to{" "}
            {Math.min(
              startIndex + rowsPerPage,
              filteredMembers.length
            )}{" "}
            out of{" "}
            {filteredMembers.length} records
          </div>

          <div className="pagination-right">

            <button
              type="button"
              className="page-btn"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(page - 1, 1)
                )
              }
            >
              ‹
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                type="button"
                key={page}
                className={`page-btn ${
                  currentPage === page
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setCurrentPage(page)
                }
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="page-btn"
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    page + 1,
                    totalPages
                  )
                )
              }
            >
              ›
            </button>

          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">

          <div className="modal-card">

            <h3>
              {editingMemberId
                ? "Edit Member"
                : "Add New Member"}
            </h3>

            <form
              onSubmit={handleFormSubmit}
              className="modal-form"
            >

              <div>
                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      name: event.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label>
                  Member ID
                </label>

                <input
                  type="text"
                  required
                  value={formData.memberId}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      memberId:
                        event.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label>
                  System Role
                </label>

                <select
                  value={formData.role}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      role:
                        event.target.value,
                    })
                  }
                >
                  <option value="User">
                    User
                  </option>

                  <option value="Supervisor">
                    Supervisor
                  </option>

                  <option value="Admin">
                    Admin
                  </option>
                </select>
              </div>

              <div>
                <label>
                  Division
                </label>

                <select
                  value={formData.division}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      division:
                        event.target.value,
                    })
                  }
                >
                  <option value="Design">
                    Design
                  </option>

                  <option value="Development">
                    Development
                  </option>

                  <option value="CPD">
                    CPD
                  </option>

                  <option value="Cyber">
                    Cyber
                  </option>

                  <option value="CSEC ASTU">
                    CSEC ASTU
                  </option>
                </select>
              </div>

              <div>
                <label>
                  Academic Year
                </label>

                <select
                  value={formData.year}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      year:
                        event.target.value,
                    })
                  }
                >
                  <option value="1st">
                    1st
                  </option>

                  <option value="2nd">
                    2nd
                  </option>

                  <option value="3rd">
                    3rd
                  </option>

                  <option value="4th">
                    4th
                  </option>

                  <option value="5th">
                    5th
                  </option>
                </select>
              </div>

              <div>
                <label>
                  Campus Status
                </label>

                <select
                  value={formData.status}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      status:
                        event.target.value,
                    })
                  }
                >
                  <option value="On Campus">
                    On Campus
                  </option>

                  <option value="Off Campus">
                    Off Campus
                  </option>

                  <option value="Withdrawn">
                    Withdrawn
                  </option>
                </select>
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-save"
                >
                  {editingMemberId
                    ? "Update"
                    : "Save"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}