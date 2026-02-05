export const API_BASE_URL = "http://localhost:5000/api";

export const testDbConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-db`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error connecting to API:", error);
    return { status: "error", message: "Failed to connect to backend", error };
  }
};

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
