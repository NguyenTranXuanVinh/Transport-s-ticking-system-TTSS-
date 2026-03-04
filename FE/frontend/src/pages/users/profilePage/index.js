import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsPersonCircle,
  BsPencilFill,
  BsCheckLg,
  BsXLg,
  BsBoxArrowRight,
  BsTicketPerforatedFill,
  BsClock,
  BsArrowRight,
  BsFileTextFill,
} from "react-icons/bs";
import { API_BASE_URL, getUserBookings } from "utils/api";
import { ROUTERS } from "utils/router";
import "./style.scss";

const STATUS_LABEL = {
  PENDING: { text: "Chờ xác nhận", cls: "status-pending" },
  CONFIRMED: { text: "Đã xác nhận", cls: "status-confirmed" },
  CANCELLED: { text: "Đã huỷ", cls: "status-cancelled" },
};

const ProfilePage = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const userInit = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState(userInit);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const [form, setForm] = useState({
    full_name: user?.name || "",
    phone_number: user?.phone_number || "",
    email: user?.email || "",
    password: "",
  });

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      const data = await getUserBookings(user.user_id);
      setBookings(data);
      setBookingsLoading(false);
    };
    fetchBookings();
  }, [user?.user_id]);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-not-logged-in">
          <BsPersonCircle className="big-icon" />
          <h2>Bạn chưa đăng nhập</h2>
          <p>Vui lòng đăng nhập để xem trang cá nhân</p>
          <button onClick={() => navigate(`/${ROUTERS.USER.LOGIN}`)}>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const payload = {
        full_name: form.full_name,
        phone_number: form.phone_number,
        email: form.email,
      };
      if (form.password) payload.password = form.password;

      const response = await fetch(
        `${API_BASE_URL}/update-profile/${user.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();

      if (response.ok) {
        const updatedUser = {
          ...user,
          name: form.full_name,
          email: form.email,
          phone_number: form.phone_number,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage({ text: "Cập nhật thành công!", type: "success" });
        setIsEditing(false);
        setForm({ ...form, password: "" });
      } else {
        setMessage({ text: data.message || "Có lỗi xảy ra.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Không thể kết nối đến máy chủ.", type: "error" });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate(`/${ROUTERS.USER.LOGIN}`);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({
      full_name: user?.name || "",
      phone_number: user?.phone_number || "",
      email: user?.email || "",
      password: "",
    });
    setMessage({ text: "", type: "" });
  };

  return (
    <div className="profile-page">
      {/* ── Thông tin cá nhân ── */}
      <div className="profile-card">
        <div className="profile-top">
          <div className="avatar-circle">
            <BsPersonCircle />
          </div>
          <div className="profile-top-info">
            <h2>{user.name}</h2>
            <span className="role-badge">{user.role}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <BsBoxArrowRight /> Đăng xuất
          </button>
        </div>

        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-fields">
          <div className="field-item">
            <label>Họ và tên</label>
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
              />
            ) : (
              <span>{user.name || "—"}</span>
            )}
          </div>

          <div className="field-item">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            ) : (
              <span>{user.email || "—"}</span>
            )}
          </div>

          <div className="field-item">
            <label>Số điện thoại</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            ) : (
              <span>{user.phone_number || "—"}</span>
            )}
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                <BsCheckLg /> {loading ? "Đang lưu..." : "Lưu"}
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                <BsXLg /> Hủy
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <BsPencilFill /> Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* ── Lịch sử đặt vé ── */}
      <div className="bookings-section">
        <div className="bookings-header">
          <BsTicketPerforatedFill className="header-icon" />
          <h3>Lịch sử đặt vé</h3>
          <span className="bookings-count">{bookings.length} đơn</span>
        </div>

        {bookingsLoading ? (
          <div className="bookings-empty">Đang tải...</div>
        ) : bookings.length === 0 ? (
          <div className="bookings-empty">Bạn chưa có đơn đặt vé nào.</div>
        ) : (
          <div className="bookings-list">
            {bookings.map((b) => {
              const statusInfo = STATUS_LABEL[b.status] || {
                text: b.status,
                cls: "",
              };
              return (
                <div className="booking-card" key={b.booking_id}>
                  <div className="booking-card-header">
                    <div className="booking-id">Đơn #{b.booking_id}</div>
                    <span className={`booking-status ${statusInfo.cls}`}>
                      {statusInfo.text}
                    </span>
                    <div className="booking-date">{b.booking_date}</div>
                  </div>

                  <div className="booking-trip-info">
                    {b.trip.image && (
                      <img
                        src={b.trip.image}
                        alt={b.trip.company}
                        className="trip-thumb"
                      />
                    )}
                    <div className="trip-text">
                      <div className="trip-company">{b.trip.company}</div>
                      <div className="trip-time">
                        <BsClock /> {b.trip.departure} <BsArrowRight />{" "}
                        {b.trip.arrival}
                      </div>
                    </div>
                  </div>

                  <div className="tickets-list">
                    {b.tickets.map((t, idx) => (
                      <div className="ticket-row" key={idx}>
                        <span className="seat-badge">Ghế {t.seat_number}</span>
                        <span className="passenger">{t.passenger_name}</span>
                        <span className="ticket-price">
                          {t.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="booking-total">
                    {b.note && (
                      <span className="booking-note">
                        <BsFileTextFill /> {b.note}
                      </span>
                    )}
                    <span className="total-label">Tổng:</span>
                    <span className="total-value">
                      {b.total_amount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ProfilePage);
