import { memo } from "react";
import "./style.scss";
import {
  BsFacebook,
  BsGithub,
  BsMailbox2Flag,
  BsPersonCircle,
} from "react-icons/bs";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <>
      <div className="header__top">
        <div className="container">
          <div className="row">
            <div className="col-6 header__top_left">
              <ul>
                <li>
                  <BsMailbox2Flag />
                  <span>Hikari@gmail.com</span>
                </li>
              </ul>
            </div>
            <div className="col-6 header__top_right">
              <ul>
                <li>
                  <Link to={"https://www.facebook.com/hikari1090"}>
                    <BsFacebook />
                  </Link>
                </li>
                <li>
                  <Link
                    to={
                      "https://github.com/NguyenTranXuanVinh/Transport-s-ticking-system-TTSS-"
                    }
                  >
                    <BsGithub />
                  </Link>
                </li>
                <li>
                  <Link to={""}>
                    <BsPersonCircle />
                  </Link>
                  <span>Đăng nhập</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xl-3">LOGO</div>
          <div className="col-xl-6">MENU</div>
          <div className="col-xl-3">PHONE</div>
        </div>
      </div>
    </>
  );
};

export default memo(Header);
