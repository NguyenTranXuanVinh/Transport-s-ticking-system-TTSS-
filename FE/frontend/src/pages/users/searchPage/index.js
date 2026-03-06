import { memo, useState, useEffect } from "react";
import { searchTickets } from "utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";

const SearchPage = () => {
  const [tickets, setTickets] = useState([]);
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(search));
    searchTickets(params).then(setTickets);
  }, [search]);

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
                  <button onClick={() => navigate(`/dat-ve/${ticket.id}`)}>
                    Chọn chuyến
                  </button>
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
