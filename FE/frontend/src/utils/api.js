export const API_BASE_URL = "http://localhost:5000/api";

export const searchTickets = async (params = {}) => {
  try {
    // Chuyển object params thành query string (vd: ?vehicle_id=1)
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/trips?${queryString}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return { status: response.status, data };
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return { status: response.status, data };
};
