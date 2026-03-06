import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "utils/api";
import "./style.scss";

const EMPTY_FORM = { email: "", password: "", fullName: "", phoneNumber: "" };

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    if (isLogin) {
      const res = await login(formData.email, formData.password);
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data));
        setSuccess("Đăng nhập thành công!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } else {
      const res = await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
      });
      if (res.status === 201) {
        setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
        setTimeout(() => {
          setIsLogin(true);
          setSuccess("");
          setError("");
          setFormData((f) => ({ ...f, password: "" }));
        }, 1500);
      } else {
        setError(res.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setSuccess("");
    setError("");
  };

  return (
    <div className="login-page-container">
      <div className="auth-form-container">
        <h2>{isLogin ? "Đăng Nhập" : "Đăng Ký"}</h2>

        {success && <div className="success-msg">{success}</div>}
        {error && <div className="error-msg">{error}</div>}

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
          <span onClick={toggleMode}>
            {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
