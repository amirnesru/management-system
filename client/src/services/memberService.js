import apiRequest from "./api";

const memberService = {
  getMembers: () => apiRequest("/members"),

  getMember: (id) => apiRequest(`/members/${id}`),

  createMember: (memberData) =>
    apiRequest("/members", {
      method: "POST",
      body: JSON.stringify(memberData),
    }),

  updateMember: (id, memberData) =>
    apiRequest(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(memberData),
    }),

  deleteMember: (id) =>
    apiRequest(`/members/${id}`, {
      method: "DELETE",
    }),
};

export default memberService;