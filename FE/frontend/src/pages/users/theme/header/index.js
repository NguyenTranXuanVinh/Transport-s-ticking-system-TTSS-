import { memo, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";

const Header = () => {
  const [vehicleId, setVehicleId] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`${ROUTERS.USER.SEARCH}?id=${vehicleId}`);
  };

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
                  <Link to="https://www.facebook.com/hikari1090">
                    <BsFacebook />
                  </Link>
                </li>
                <li>
                  <Link to="https://github.com/NguyenTranXuanVinh/Transport-s-ticking-system-TTSS-">
                    <BsGithub />
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${user ? ROUTERS.USER.PROFILE : ROUTERS.USER.LOGIN}`}
                  >
                    <BsPersonCircle />
                    <span>{user ? user.name : "Đăng nhập"}</span>
                  </Link>
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
              <div className="header_logo">
                <div style={{ fontSize: "30px" }}>
                  <BsFillTrainFrontFill />
                  <BsBusFrontFill />
                  <Link to={`/${ROUTERS.USER.HOME}`}>
                    <span>Hệ thống bán vé tàu xe</span>
                  </Link>
                  <BsFillTicketPerforatedFill />
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="header_cart">
                <div
                  className="header__cart_price"
                  style={{ fontSize: "20px" }}
                />
                <ul>
                  <li>
                    <Link to="#">
                      <BsCart4 />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="search_bar">
        <form onSubmit={handleSearch}>
          <div>
            <input
              type="text"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            />
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
