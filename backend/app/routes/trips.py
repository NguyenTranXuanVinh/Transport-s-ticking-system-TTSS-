from flask import Blueprint, request, jsonify

# Import các công cụ cần thiết từ dự án của bạn
from extensions import db
from models import Trip, Vehicle, Booking, Ticket, Payment

# Khởi tạo Blueprint cho các API liên quan đến chuyến đi
trips_bp = Blueprint('trips', __name__)

# ==========================================
# 1. API TÌM KIẾM CHUYẾN XE (CỦA BẠN - GIỮ NGUYÊN)
# ==========================================
@trips_bp.route('/trips', methods=['GET'])
def search_trips():
    trip_id = request.args.get('id')
    query = Trip.query

    if trip_id:
        query = query.filter(Trip.trip_id == trip_id)

    trips = query.all()

    result = [{
        "id": t.trip_id,
        "company": t.vehicle.vehicle_name if t.vehicle else "Nhà xe TTSS",
        "startTime": t.departure_time.strftime('%H:%M %d/%m') if t.departure_time else "",
        "endTime": t.arrival_time.strftime('%H:%M %d/%m') if t.arrival_time else "",
        "price": "{:,.0f}đ".format(t.base_price) if t.base_price else "0đ",
        "seatsLeft": t.vehicle.total_seats if t.vehicle else 0,
        "rating": t.vehicle.rating if t.vehicle and t.vehicle.rating else 0,
        "ratingCount": t.vehicle.rating_count if t.vehicle and t.vehicle.rating_count is not None else 0,
        "isInstant": False,
        "image": t.vehicle.image_url if t.vehicle and t.vehicle.image_url else "https://via.placeholder.com/300x200?text=No+Image"
    } for t in trips]

    return jsonify(result)

# ==========================================
# 2. API ĐẶT VÉ
# ==========================================
@trips_bp.route('/book', methods=['POST'])
def book_ticket():
    try:
        # Nhận túi dữ liệu (JSON) từ Frontend gửi lên
        data = request.get_json()
        
        user_id = data.get('user_id')
        trip_id = data.get('trip_id')
        seat_numbers = data.get('seats') # Ví dụ: ['A1', 'A2']
        total_amount = data.get('total_amount')

        # Kiểm tra xem có gửi thiếu gì không
        if not all([user_id, trip_id, seat_numbers, total_amount]):
            return jsonify({"error": "Thiếu thông tin đặt vé!"}), 400

        # GHI SỔ: Tạo 1 Đơn hàng (Booking)
        new_booking = Booking(
            user_id=user_id,
            trip_id=trip_id,
            total_amount=total_amount,
            status='SUCCESS' 
        )
        db.session.add(new_booking)
        db.session.flush() # Lấy booking_id trước khi commit toàn bộ

        # IN VÉ: Tạo danh sách Vé (Tickets) tương ứng với số ghế
        price_per_ticket = total_amount / len(seat_numbers)
        
        for seat in seat_numbers:
            new_ticket = Ticket(
                booking_id=new_booking.booking_id, 
                seat_number=seat,
                passenger_name=u"Khách hàng",
                price=price_per_ticket
            )
            db.session.add(new_ticket)

        # THU TIỀN: Lưu lịch sử thanh toán (Payment)
        new_payment = Payment(
            booking_id=new_booking.booking_id,
            payment_method="CASH",
            amount=total_amount,
            status="SUCCESS"
        )
        db.session.add(new_payment)

        # CHỐT SỔ: Lưu tất cả vào Database
        db.session.commit()

        return jsonify({
            "message": "Tuyệt vời! Đặt vé thành công.", 
            "booking_id": new_booking.booking_id
        }), 201

    except Exception as e:
        db.session.rollback() # Hủy bỏ nếu có lỗi
        return jsonify({"error": str(e)}), 500
    