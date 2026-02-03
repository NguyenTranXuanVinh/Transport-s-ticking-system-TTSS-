import { memo } from "react";
import "./style.scss";
import {
  BsFacebook,
  BsGithub,
  BsMailbox2Flag,
  BsPersonCircle,
  BsFillTrainFrontFill,
  BsCart4,
  BsFillTicketPerforatedFill,
  BsBusFrontFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { formatter } from "utils/formatter";
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
      <div className="header__bottom">
        <div className="container">
          <div className="row">
            <div className="col-xl-4">
              <div className="header_logo ">
                <div style={{ fontSize: "30px" }}>
                  <BsFillTrainFrontFill />
                  <BsBusFrontFill />
                  <span>Hệ thống bán vé tàu xe</span>
                  <BsFillTicketPerforatedFill />
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="header_cart">
                <div
                  className="header__cart_price"
                  style={{ fontSize: "20px" }}
                >
                  <span>{formatter(300)}</span>
                </div>
                <ul>
                  <li>
                    <Link to="#">
                      <BsCart4 />
                      <span>5</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="search_bar">
        <form action="#">
          <div>
            <input type="text" placeholder="Tìm kiếm xe" />
            <button type="submit" className="button-submit">
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default memo(Header);
