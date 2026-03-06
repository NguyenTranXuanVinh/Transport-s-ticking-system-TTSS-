from flask import Blueprint, request, jsonify
from extensions import db
from models import Booking, Ticket, Trip, Vehicle

bookings_bp = Blueprint('bookings', __name__)

# POST /api/bookings — Đặt vé, tạo booking và các ticket cho từng ghế
@bookings_bp.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()

    # Kiểm tra các trường bắt buộc trong request body
    required = ['user_id', 'trip_id', 'seats']
    for field in required:
        if not data or field not in data:
            return jsonify({"error": f"Thiếu trường bắt buộc: {field}"}), 400

    trip = Trip.query.get(data['trip_id'])
    if not trip:
        return jsonify({"error": "Không tìm thấy chuyến xe"}), 404

    seats = data['seats']
    if not isinstance(seats, list) or len(seats) == 0:
        return jsonify({"error": "Danh sách ghế không hợp lệ"}), 400

    total_amount = float(trip.base_price) * len(seats)

    booking = Booking(
        user_id=data['user_id'],
        trip_id=data['trip_id'],
        total_amount=total_amount,
        status='CONFIRMED',
        note=data.get('note', '')
    )
    db.session.add(booking)
    db.session.flush()  # Lấy booking_id trước khi tạo ticket

    # Tạo ticket riêng cho từng ghế
    tickets = []
    for seat in seats:
        ticket = Ticket(
            booking_id=booking.booking_id,
            seat_number=seat.get('seat_number', ''),
            passenger_name=seat.get('passenger_name', ''),
            price=trip.base_price
        )
        db.session.add(ticket)
        tickets.append(ticket)

    db.session.commit()

    return jsonify({
        "message": "Đặt vé thành công",
        "booking_id": booking.booking_id,
        "trip_id": booking.trip_id,
        "total_amount": total_amount,
        "status": booking.status,
        "seats_booked": len(tickets)
    }), 201


# GET /api/bookings/user/<user_id> — Lấy lịch sử đặt vé của user
@bookings_bp.route('/bookings/user/<int:user_id>', methods=['GET'])
def get_user_bookings(user_id):
    bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.booking_date.desc()).all()

    result = []
    for b in bookings:
        trip = b.trip
        vehicle = trip.vehicle if trip else None
        tickets_data = [
            {
                "seat_number": t.seat_number,
                "passenger_name": t.passenger_name,
                "price": float(t.price)
            }
            for t in b.tickets
        ]
        result.append({
            "booking_id": b.booking_id,
            "booking_date": b.booking_date.strftime('%d/%m/%Y %H:%M') if b.booking_date else "",
            "status": b.status,
            "total_amount": float(b.total_amount),
            "note": b.note or "",
            "trip": {
                "trip_id": trip.trip_id if trip else None,
                "company": vehicle.vehicle_name if vehicle else "",
                "departure": trip.departure_time.strftime('%H:%M %d/%m/%Y') if trip and trip.departure_time else "",
                "arrival": trip.arrival_time.strftime('%H:%M %d/%m/%Y') if trip and trip.arrival_time else "",
                "image": vehicle.img_url if vehicle else "",
            },
            "tickets": tickets_data
        })

    return jsonify(result)
