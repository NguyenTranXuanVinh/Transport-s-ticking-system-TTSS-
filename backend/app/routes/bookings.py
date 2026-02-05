from flask import Blueprint, request, jsonify
from extensions import db
from models import Booking, Ticket, Trip

bookings_bp = Blueprint('bookings', __name__)

# API Đặt vé
@bookings_bp.route('/book', methods=['POST'])
def book_ticket():
    data = request.json
    trip_id = data.get('trip_id')
    user_id = data.get('user_id', 1) # Default user 1 nếu chưa login
    seat_number = data.get('seat_number', 'A1')
    customer_name = data.get('customer_name', 'Khách vãng lai')

    # Kiểm tra chuyến
    trip = Trip.query.get(trip_id)
    if not trip:
        return jsonify({"message": "Không tìm thấy chuyến xe"}), 404

    # Tạo Booking
    new_booking = Booking(
        user_id=user_id,
        trip_id=trip_id,
        total_amount=trip.base_price,
        status='CONFIRMED', # Giả sử confirm luôn
        note=f"Khách đặt: {customer_name}"
    )
    db.session.add(new_booking)
    db.session.flush() # Để lấy booking_id

    # Tạo Ticket
    new_ticket = Ticket(
        booking_id=new_booking.booking_id,
        seat_number=seat_number,
        passenger_name=customer_name,
        price=trip.base_price
    )
    db.session.add(new_ticket)
    db.session.commit()

    return jsonify({"message": "Đặt vé thành công!", "ticket": seat_number})
