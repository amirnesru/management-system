import apiRequest from "./api";

const attendanceService = {
  getAttendance: () => apiRequest("/attendance"),

  createAttendance: (attendanceData) =>
    apiRequest("/attendance", {
      method: "POST",
      body: JSON.stringify(attendanceData),
    }),

  updateAttendance: (id, attendanceData) =>
    apiRequest(`/attendance/${id}`, {
      method: "PUT",
      body: JSON.stringify(attendanceData),
    }),
};

export default attendanceService;