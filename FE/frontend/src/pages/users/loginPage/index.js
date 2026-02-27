import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../../../utils/api";
import "./style.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  // Dữ liệu người dùng nhập vào form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
  });

  // Thông báo thành công sau khi xử lý
  const [success, setSuccess] = useState("");
  // Trạng thái đang gửi request
  const [loading, setLoading] = useState(false);

  /**
   * Cập nhật giá trị formData khi người dùng nhập liệu vào input.
   * Sử dụng thuộc tính `name` của input để xác định trường cần cập nhật.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Xử lý submit form.
   * - Nếu đang ở chế độ đăng nhập: gọi API login, lưu user vào localStorage, chuyển về trang chủ.
   * - Nếu đang ở chế độ đăng ký: gọi API register, sau đó tự động chuyển sang form đăng nhập.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setLoading(true);

    if (isLogin) {
      // Đăng nhập: gọi API và lưu thông tin user vào localStorage
      const res = await login(formData.email, formData.password);
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data));
        setSuccess("Đăng nhập thành công!");
        setTimeout(() => {
          navigate("/"); // Chuyển về trang chủ
        }, 1000);
      }
    } else {
      // Đăng ký: gọi API tạo tài khoản mới
      const res = await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
      });

      if (res.status === 201) {
        setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
        // Chuyển sang form đăng nhập sau 1.5 giây
        setTimeout(() => {
          setIsLogin(true);
          setSuccess("");
          setFormData({ ...formData, password: "" }); // Xóa mật khẩu đã nhập
        }, 1500);
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-page-container">
      <div className="auth-form-container">
        <h2>{isLogin ? "Đăng Nhập" : "Đăng Ký"}</h2>

        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                placeholder="Nhập họ tên của bạn"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Nhập số điện thoại"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang xử lý..." : isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </button>
        </form>

        <div className="switch-mode">
          <span
            onClick={() => {
              setIsLogin(!isLogin);

              setSuccess("");
            }}
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
