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

export const searchTickets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};
