import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsPersonCircle,
  BsPencilFill,
  BsCheckLg,
  BsXLg,
  BsBoxArrowRight,
} from "react-icons/bs";
import { API_BASE_URL } from "utils/api";
import { ROUTERS } from "utils/router";
import "./style.scss";

const ProfilePage = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const userInit = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState(userInit);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    full_name: user?.name || "",
    phone_number: user?.phone_number || "",
    email: user?.email || "",
    password: "",
  });

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
      <div className="profile-card">
        {/* Avatar + tên */}
        <div className="profile-top">
          <div className="avatar-circle">
            <BsPersonCircle />
          </div>
          <div className="profile-top-info">
            <h2>{user.name}</h2>
            <span className="role-badge">
              {user.role === "CUSTOMER" ? "Khách hàng" : user.role}
            </span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <BsBoxArrowRight /> Đăng xuất
          </button>
        </div>

        {/* Thông báo */}
        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Các trường thông tin */}
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

          {isEditing && (
            <div className="field-item">
              <label>
                Mật khẩu mới{" "}
                <span className="optional">(để trống nếu không đổi)</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
              />
            </div>
          )}
        </div>

        {/* Hành động */}
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
    </div>
  );
};

export default memo(ProfilePage);
