import { memo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { searchTickets, bookTicket } from "utils/api";
import "./style.scss";

const EMPTY_PASSENGER = { seat_number: "", passenger_name: "" };

const PassengerInput = ({ label, ...props }) => (
  <div className="form-group">
    <label>{label}</label>
    <input type="text" required {...props} />
  </div>
);

const BookingPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatCount, setSeatCount] = useState(1);
  const [passengers, setPassengers] = useState([{ ...EMPTY_PASSENGER }]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    searchTickets({ id: tripId }).then((data) => {
      setTrip(data?.[0] ?? null);
      setLoading(false);
    });
  }, [tripId]);

  const handleSeatCountChange = (value) => {
    // Giới hạn số ghế từ 1 đến 10
    const count = Math.max(1, Math.min(10, Number(value)));
    setSeatCount(count);

    setPassengers((prev) => {
      const newPassengers = [];
      for (let i = 0; i < count; i++) {
        // Nếu hành khách thứ i đã có thông tin → giữ lại, chưa có → tạo ô trống
        newPassengers.push(prev[i] ?? { ...EMPTY_PASSENGER });
      }
      return newPassengers;
    });
  };

  const handlePassengerChange = (index, field, value) =>
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      setMessage({
        type: "error",
        text: "Vui lòng đăng nhập trước khi đặt vé!",
      });
      return;
    }

    setSubmitting(true);
    const { status, data } = await bookTicket({
      user_id: user.user_id,
      trip_id: Number(tripId),
      seats: passengers,
      note,
    });

    setMessage(
      status === 201
        ? {
            type: "success",
            text: `Đặt vé thành công! Mã booking: #${data.booking_id}`,
          }
        : {
            type: "error",
            text:
              data?.error ||
              data?.message ||
              "Đặt vé thất bại, vui lòng thử lại.",
          },
    );
    if (status === 201) setTimeout(() => navigate("/"), 2500);
    setSubmitting(false);
  };

  if (loading)
    return <div className="booking-loading">Đang tải thông tin chuyến...</div>;
  if (!trip)
    return <div className="booking-loading">Không tìm thấy chuyến xe.</div>;

  const totalPrice = parseFloat(trip.price.replace(/[^0-9]/g, "")) * seatCount;

  const tripDetails = [
    { label: "Nhà xe", value: trip.company },
    { label: "Khởi hành", value: trip.startTime },
    { label: "Đến nơi", value: trip.endTime },
    { label: "Đánh giá", value: `${trip.rating}`, cls: "rating-star" },
    { label: "Ghế trống", value: `${trip.seatsLeft} ghế` },
    {
      label: "Giá/ghế",
      value: trip.price,
      rowCls: "price-row",
      cls: "price-tag",
    },
  ];

  return (
    <div className="container booking-page-container">
      <div className="booking-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <h2>Đặt vé</h2>
      </div>

      <div className="booking-layout">
        <div className="trip-summary card">
          <h3>Thông tin chuyến xe</h3>
          <img src={trip.image} alt={trip.company} className="trip-img" />
          {tripDetails.map(({ label, value, rowCls = "", cls = "" }) => (
            <div key={label} className={`trip-detail-row ${rowCls}`}>
              <span className="label">{label}</span>
              <span className={`value ${cls}`}>{value}</span>
            </div>
          ))}
        </div>

        <div className="booking-form-wrap card">
          <h3>Thông tin đặt vé</h3>

          {message.text && (
            <div className={`booking-msg ${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Số lượng ghế</label>
              <div className="seat-counter">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => handleSeatCountChange(seatCount - 1)}
                >
                  −
                </button>
                <span className="counter-val">{seatCount}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => handleSeatCountChange(seatCount + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {passengers.map((p, i) => (
              <div className="passenger-block" key={i}>
                <h4>Hành khách {i + 1}</h4>
                <div className="form-row">
                  <PassengerInput
                    label="Số ghế"
                    placeholder="VD: A1, B2..."
                    value={p.seat_number}
                    onChange={(e) =>
                      handlePassengerChange(i, "seat_number", e.target.value)
                    }
                  />
                  <PassengerInput
                    label="Họ tên hành khách"
                    placeholder="Nhập họ tên"
                    value={p.passenger_name}
                    onChange={(e) =>
                      handlePassengerChange(i, "passenger_name", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            <div className="form-group">
              <label>Ghi chú (tuỳ chọn)</label>
              <textarea
                rows={3}
                placeholder="VD: Yêu cầu ghế cửa sổ, thức ăn riêng..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="booking-footer">
              <div className="total-price">
                Tổng: <strong>{totalPrice.toLocaleString("vi-VN")}đ</strong>
              </div>
              <button type="submit" className="btn-book" disabled={submitting}>
                {submitting ? "Đang đặt..." : "Xác nhận đặt vé"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(BookingPage);
