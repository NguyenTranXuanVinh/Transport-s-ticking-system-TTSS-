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

/**
 * Đặt vé chuyến xe
 * @param {Object} bookingData
 * @param {number} bookingData.user_id       - ID người dùng
 * @param {number} bookingData.trip_id       - ID chuyến xe
 * @param {Array}  bookingData.seats         - Danh sách ghế [{ seat_number, passenger_name }]
 * @param {string} [bookingData.note]        - Ghi chú (tuỳ chọn)
 */
export const bookTicket = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error("Error booking ticket:", error);
    return { status: 500, data: { error: "Lỗi kết nối server" } };
  }
};

export const getUserBookings = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};
