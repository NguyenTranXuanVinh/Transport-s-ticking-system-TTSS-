import { memo, useState, useEffect } from "react";
import { searchTickets } from "../../../utils/api";
import { useLocation } from "react-router-dom";
import "./style.scss";

const SearchPage = () => {
  const [tickets, setTickets] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchTickets = async () => {
      // 1. Phân tích tham số từ URL
      const searchParams = new URLSearchParams(location.search);
      const params = Object.fromEntries(searchParams.entries());

      // Gọi API với tất cả tham số
      const data = await searchTickets(params);
      setTickets(data);
    };
    fetchTickets();
  }, [location.search]); // Chạy lại khi URL thay đổi

  return (
    <div className="container search-page-container">
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
                  <div className="rating">{ticket.rating}</div>
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
