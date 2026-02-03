import { memo } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import {
  BsFillTrainFrontFill,
  BsTwitterX,
  BsFacebook,
  BsInstagram,
} from "react-icons/bs";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="footer__about">
              <BsFillTrainFrontFill style={{ fontSize: "30px" }} />
              <h1 className="footer__about_logo">TTTS</h1>
              <ul>
                <li>Địa Chỉ : Đà Nẵng</li>
                <li>Phone:123456789</li>
                <li>Email:Hikari@gmail.com</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="footer__widget">
              <h6>Cửa hàng</h6>
              <ul>
                <li>
                  <Link to="">Liên hệ</Link>
                </li>
                <li>
                  <Link to="">Thông tin về chúng tôi</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="footer__widget">
              <h6>&nbsp;</h6>
              {/*&nbsp;Non-Breaking Space, tạo khoảng trắng để cũng hàng với Cửa hàng  */}
              <ul>
                <li>
                  <Link to="">Thông tin tài khoản</Link>
                </li>
                <li>
                  <Link to="">Giỏ hàng</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="footer__widget">
              <h6>Theo dõi chúng tôi</h6>
              <ul>
                <li>
                  <BsFacebook /> Facebook
                </li>
                <li>
                  <BsInstagram /> Instagram
                </li>
                <li>
                  <BsTwitterX /> Twitter
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
