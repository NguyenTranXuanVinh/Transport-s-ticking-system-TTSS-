from flask import Blueprint, request, jsonify
from extensions import db
from models import Booking, Ticket, Trip
from routes.utils import get_booked_seats

bookings_bp = Blueprint('bookings', __name__)

# POST /api/bookings — Đặt vé
@bookings_bp.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()

    required = ['user_id', 'trip_id', 'seats']
    for field in required:
        if not data or field not in data:
            return jsonify({"error": f"Thiếu trường bắt buộc: {field}"}), 400

    try:
        trip = db.session.get(Trip, data['trip_id'])
        if not trip:
            return jsonify({"error": "Không tìm thấy chuyến xe"}), 404

        seats = data['seats']
        if not isinstance(seats, list) or len(seats) == 0:
            return jsonify({"error": "Danh sách ghế không hợp lệ"}), 400

        total_seats = trip.vehicle.total_seats if trip.vehicle else 0
        seats_left = total_seats - get_booked_seats(data['trip_id'])
        if len(seats) > seats_left:
            return jsonify({"error": f"Không đủ ghế trống. Còn lại: {seats_left} ghế."}), 400

        total_amount = float(trip.base_price) * len(seats)

        booking = Booking(
            user_id=data['user_id'],
            trip_id=data['trip_id'],
            total_amount=total_amount,
            status='PENDING',
            note=data.get('note', '')
        )
        db.session.add(booking)
        db.session.flush()

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

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Lỗi hệ thống: {str(e)}"}), 500


# GET /api/bookings/user/<user_id> — Lấy lịch sử đặt vé của user
@bookings_bp.route('/bookings/user/<int:user_id>', methods=['GET'])
def get_user_bookings(user_id):
    bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.booking_date.desc()).all()

    result = []
    for b in bookings:
        trip = b.trip
        vehicle = trip.vehicle if trip else None
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
            "tickets": [
                {"seat_number": t.seat_number, "passenger_name": t.passenger_name, "price": float(t.price)}
                for t in b.tickets
            ]
        })

    return jsonify(result)
