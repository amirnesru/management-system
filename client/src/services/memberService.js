const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const memberService = {
  // =========================
  // GET all members
  // =========================
  getAllMembers: async () => {
    const response = await fetch(`${API_BASE_URL}/members`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        errorData.message || "Failed to fetch members"
      );
    }

    return await response.json();
  },

  // =========================
  // GET all users
  // Used for Add Member dropdown
  // =========================
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        errorData.message || "Failed to fetch users"
      );
    }

    return await response.json();
  },

  // =========================
  // POST create member
  // =========================
  createMember: async (memberData) => {
    const response = await fetch(`${API_BASE_URL}/members`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        errorData.message || "Failed to create member"
      );
    }

    return await response.json();
  },

  // =========================
  // PUT update member
  // =========================
  updateMember: async (id, memberData) => {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        errorData.message || "Failed to update member"
      );
    }

    return await response.json();
  },

  // =========================
  // DELETE member
  // =========================
  deleteMember: async (id) => {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        errorData.message || "Failed to delete member"
      );
    }

    return await response.json();
  },
};