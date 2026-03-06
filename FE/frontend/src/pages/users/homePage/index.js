import { memo, useState, useEffect } from "react";
import { searchTickets } from "utils/api";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const HomePage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  // Lấy toàn bộ danh sách chuyến xe khi trang được tải
  useEffect(() => {
    searchTickets().then((data) => {
      setTrips(data);
    });
  }, []);

  return (
    <div className="container home-page-container">
      <div className="home-header">
        <h2>Tất cả chuyến xe</h2>
        <span>{trips.length} chuyến</span>
      </div>

      {
        <div className="ticket-list">
          {trips.map((trip) => (
            <div key={trip.id} className="ticket-item">
              <div className="ticket-image">
                <img src={trip.image} alt={trip.company} />
              </div>
              <div className="ticket-info">
                <div className="company-info">
                  <h4>{trip.company}</h4>
                  <div className="rating">{trip.rating}</div>
                </div>
                <div className="detail-row">
                  <span className="time-group">
                    {trip.startTime} - {trip.endTime}
                  </span>
                  <span className="dot">•</span>
                  <span className="seats-info">{trip.seatsLeft} ghế trống</span>
                </div>
              </div>
              <div className="ticket-action">
                <div className="price">{trip.price}</div>
                <div className="action-bottom">
                  {/* Điều hướng đến trang đặt vé với trip ID */}
                  <button onClick={() => navigate(`/dat-ve/${trip.id}`)}>
                    Chọn chuyến
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default memo(HomePage);
