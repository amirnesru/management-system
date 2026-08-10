import apiRequest from "./api";

const authService = {
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }),

  signup: (userData) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
};

export default authService;