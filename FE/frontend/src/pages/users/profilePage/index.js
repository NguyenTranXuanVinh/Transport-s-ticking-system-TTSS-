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

const initForm = (u) => ({
  full_name: u.name,
  phone_number: u.phone_number,
  email: u.email,
});

const FIELDS = (u) => [
  {
    label: "Họ và tên",
    type: "text",
    name: "full_name",
    placeholder: "Nhập họ và tên",
    value: u.name,
  },
  {
    label: "Email",
    type: "email",
    name: "email",
    placeholder: "Nhập email",
    value: u.email,
  },
  {
    label: "Số điện thoại",
    type: "tel",
    name: "phone_number",
    placeholder: "Nhập số điện thoại",
    value: u.phone_number,
  },
];

const BookingCard = ({ b }) => (
  <div className="booking-card">
    <div className="booking-card-header">
      <div className="booking-id">Đơn #{b.booking_id}</div>
      <span className="booking-status status-confirmed">Đã xác nhận</span>
      <div className="booking-date">{b.booking_date}</div>
    </div>
    <div className="booking-trip-info">
      {b.trip.image && (
        <img src={b.trip.image} alt={b.trip.company} className="trip-thumb" />
      )}
      <div className="trip-text">
        <div className="trip-company">{b.trip.company}</div>
        <div className="trip-time">
          <BsClock /> {b.trip.departure} <BsArrowRight /> {b.trip.arrival}
        </div>
      </div>
    </div>
    <div className="tickets-list">
      {b.tickets.map((t, i) => (
        <div className="ticket-row" key={i}>
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

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [form, setForm] = useState(() => initForm(user));

  useEffect(() => {
    if (!user) return;
    getUserBookings(user.user_id).then((data) => {
      setBookings(data);
      setBookingsLoading(false);
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCancel = () => {
    setIsEditing(false);
    setForm(initForm(user));
    setMessage({ text: "", type: "" });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    const res = await fetch(`${API_BASE_URL}/update-profile/${user.user_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: form.full_name,
        phone_number: form.phone_number,
        email: form.email,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      const updated = {
        ...user,
        name: form.full_name,
        email: form.email,
        phone_number: form.phone_number,
      };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setMessage({ text: "Cập nhật thành công!", type: "success" });
      setIsEditing(false);
      setForm((f) => ({ ...f, password: "" }));
    } else {
      setMessage({ text: data.message || "Có lỗi xảy ra.", type: "error" });
    }

    setLoading(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-top">
          <div className="avatar-circle">
            <BsPersonCircle />
          </div>
          <div className="profile-top-info">
            <h2>{user.name}</h2>
            <span className="role-badge">{user.role}</span>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user");
              navigate(`/${ROUTERS.USER.LOGIN}`);
            }}
          >
            <BsBoxArrowRight /> Đăng xuất
          </button>
        </div>

        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-fields">
          {FIELDS(user).map(({ label, type, name, placeholder, value }) => (
            <div className="field-item" key={name}>
              <label>{label}</label>
              {isEditing ? (
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                />
              ) : (
                <span>{value || "—"}</span>
              )}
            </div>
          ))}
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
            {bookings.map((b) => (
              <BookingCard key={b.booking_id} b={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ProfilePage);
