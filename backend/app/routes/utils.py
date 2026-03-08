from extensions import db
from models import Booking, Ticket
from sqlalchemy import func


def get_booked_seats(trip_id):
    """Đếm số ghế đã đặt (PENDING hoặc CONFIRMED) cho một chuyến."""
    count = db.session.query(func.count(Ticket.ticket_id))\
        .join(Booking, Ticket.booking_id == Booking.booking_id)\
        .filter(
            Booking.trip_id == trip_id,
            Booking.status.in_(['PENDING', 'CONFIRMED'])
        ).scalar()
    return count or 0
