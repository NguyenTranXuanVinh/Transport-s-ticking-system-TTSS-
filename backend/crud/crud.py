from sqlalchemy.orm import Session
import models, schemas

# 1. Lấy danh sách chuyến đi
def get_trips(db: Session):
    return db.query(models.Trip).all()

# 2. Tạo chuyến đi mới
def create_trip(db: Session, trip: schemas.TripCreate):
    db_trip = models.Trip(
        route=trip.route, 
        price=trip.price, 
        seats_left=trip.seats_left
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

# 3. Đặt vé (Quan trọng)
def create_booking(db: Session, booking: schemas.BookingCreate):
    # Tìm chuyến xe xem có tồn tại không
    trip = db.query(models.Trip).filter(models.Trip.id == booking.trip_id).first()
    if not trip:
        return None # Không tìm thấy chuyến
    
    if trip.seats_left <= 0:
        return False # Hết vé

    # Trừ đi 1 ghế
    trip.seats_left -= 1
    
    # Tạo vé
    db_booking = models.Booking(
        trip_id=booking.trip_id,
        customer_name=booking.customer_name,
        seat_number=booking.seat_number
    )
    
    db.add(db_booking)
    db.commit()
    return db_booking