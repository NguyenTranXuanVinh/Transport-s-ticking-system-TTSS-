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
  // Giá trị ID chuyến đi người dùng nhập vào ô tìm kiếm
  const [vehicleId, setVehicleId] = useState("");
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleSearch = (e) => {
    e.preventDefault();
    // Chuyển hướng sang trang tìm kiếm với tham số id
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
                  {user ? (
                    <Link to={`/${ROUTERS.USER.PROFILE}`}>
                      <BsPersonCircle />
                      <span>{user.name}</span>
                    </Link>
                  ) : (
                    <Link to={`/${ROUTERS.USER.LOGIN}`}>
                      <BsPersonCircle />
                      <span>Đăng nhập</span>
                    </Link>
                  )}
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
                ></div>
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
              placeholder="Nhập ID chuyến đi để tìm kiếm..."
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
