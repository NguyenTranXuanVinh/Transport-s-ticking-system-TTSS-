import { memo, useState, useEffect } from "react";
import { searchTickets } from "../../../utils/api";
import { useLocation } from "react-router-dom";
import "./style.scss";
// Assuming you have image assets or can use placeholders
// import someImage from "path/to/image";

const SearchPage = () => {
  const [sortOption, setSortOption] = useState("default");
  const [tickets, setTickets] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchTickets = async () => {
      // Lấy vehicle_id từ URL
      const searchParams = new URLSearchParams(location.search);
      const vehicleId = searchParams.get("vehicle_id");

      // Gọi API với tham số vehicle_id (nếu có)
      const data = await searchTickets({ vehicle_id: vehicleId });
      setTickets(data);
    };
    fetchTickets();
  }, [location.search]); // Chạy lại khi URL thay đổi

  return (
    <div className="container search-page-container">
      <div className="sidebar">
        <div className="filter-group">
          <h3>Sắp xếp</h3>
          <ul className="filter-list">
            <li>
              <input
                type="radio"
                name="sort"
                id="default"
                checked={sortOption === "default"}
                onChange={() => setSortOption("default")}
              />
              <label htmlFor="default">Mặc định</label>
            </li>
            <li>
              <input
                type="radio"
                name="sort"
                id="early"
                checked={sortOption === "early"}
                onChange={() => setSortOption("early")}
              />
              <label htmlFor="early">Giờ đi sớm nhất</label>
            </li>
            <li>
              <input
                type="radio"
                name="sort"
                id="late"
                checked={sortOption === "late"}
                onChange={() => setSortOption("late")}
              />
              <label htmlFor="late">Giờ đi muộn nhất</label>
            </li>
            <li>
              <input
                type="radio"
                name="sort"
                id="rating"
                checked={sortOption === "rating"}
                onChange={() => setSortOption("rating")}
              />
              <label htmlFor="rating">Đánh giá cao nhất</label>
            </li>
            <li>
              <input
                type="radio"
                name="sort"
                id="price-asc"
                checked={sortOption === "price-asc"}
                onChange={() => setSortOption("price-asc")}
              />
              <label htmlFor="price-asc">Giá tăng dần</label>
            </li>
            <li>
              <input
                type="radio"
                name="sort"
                id="price-desc"
                checked={sortOption === "price-desc"}
                onChange={() => setSortOption("price-desc")}
              />
              <label htmlFor="price-desc">Giá giảm dần</label>
            </li>
          </ul>
        </div>
      </div>

      <div className="search-content">
        <div className="results-header">
          <h2>Kết quả: {tickets.length} chuyến</h2>
        </div>

        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-item">
              <div className="ticket-image">
                <img src={ticket.image} alt={ticket.company} />
                {ticket.isInstant && (
                  <div className="tag-instant">Xác nhận tức thì</div>
                )}
              </div>
              <div className="ticket-info">
                <div className="company-info">
                  <h4>{ticket.company}</h4>
                  <div className="rating">
                    <i className="fa fa-star"></i> {ticket.rating}
                  </div>
                </div>
                <div className="detail-row">
                  <span className="time-group">
                    {ticket.startTime} - {ticket.endTime}
                  </span>
                  <span className="dot">•</span>
                  <span className="seats-info">
                    {ticket.seatsLeft} ghế trống
                  </span>
                </div>
              </div>
              <div className="ticket-action">
                <div className="price">{ticket.price}</div>
                <div className="action-bottom">
                  <span className="seats-left">
                    Còn {ticket.seatsLeft} chỗ trống
                  </span>
                  <button>Chọn chuyến</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(SearchPage);
