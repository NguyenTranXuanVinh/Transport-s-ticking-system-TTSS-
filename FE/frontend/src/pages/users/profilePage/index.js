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

  // Lấy dữ liệu user đã lưu trong localStorage (null nếu chưa đăng nhập)
  const storedUser = localStorage.getItem("user");
  const userInit = storedUser ? JSON.parse(storedUser) : null;

  // Dữ liệu user hiện tại đang hiển thị
  const [user, setUser] = useState(userInit);
  // Trạng thái đang ở chế độ chỉnh sửa hay chỉ xem
  const [isEditing, setIsEditing] = useState(false);
  // Trạng thái đang gửi request cập nhật
  const [loading, setLoading] = useState(false);
  // Thông báo kết quả sau khi cập nhật
  const [message, setMessage] = useState({ text: "", type: "" });

  // Dữ liệu form chỉnh sửa, khởi tạo từ thông tin user hiện tại
  const [form, setForm] = useState({
    full_name: user?.name || "",
    phone_number: user?.phone_number || "",
    email: user?.email || "",
    password: "",
  });

  // Nếu chưa đăng nhập thì hiển thị màn hình thông báo
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

  /**
   * Cập nhật giá trị form khi người dùng nhập liệu vào input.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Gửi request PUT lên API để cập nhật thông tin cá nhân.
   * Nếu thành công: cập nhật localStorage và state user, tắt chế độ chỉnh sửa.
   * Nếu thất bại: hiển thị thông báo lỗi từ server hoặc lỗi kết nối.
   */
  const handleSave = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const payload = {
        full_name: form.full_name,
        phone_number: form.phone_number,
        email: form.email,
      };
      // Chỉ gửi password nếu người dùng có nhập
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
        // Cập nhật thông tin user trong localStorage và state
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

  //Đăng xuất: xóa thông tin user khỏi localStorage và chuyển sang trang đăng nhập.

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate(`/${ROUTERS.USER.LOGIN}`);
  };

  //Hủy chỉnh sửa: đặt lại form về dữ liệu user hiện tại, tắt chế độ chỉnh sửa.

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
