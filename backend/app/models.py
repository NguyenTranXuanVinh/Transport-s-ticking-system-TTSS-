from datetime import datetime
from extensions import db

# 1. Bảng Users
class User(db.Model):
    __tablename__ = 'Users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.Unicode(100), nullable=False) 
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(15))
    role = db.Column(db.String(20), default='CUSTOMER')
    
    bookings = db.relationship("Booking", back_populates="user")

# 2. Stations
class Station(db.Model):
    __tablename__ = 'Stations'

    station_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # Đổi String -> Unicode
    station_name = db.Column(db.Unicode(100), nullable=False)
    city = db.Column(db.Unicode(50), nullable=False)
    address = db.Column(db.UnicodeText) # UnicodeText cho địa chỉ dài
    is_active = db.Column(db.Boolean, default=True)

# 3. Vehicles
class Vehicle(db.Model):
    __tablename__ = 'Vehicles'

    vehicle_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vehicle_name = db.Column(db.Unicode(100)) # Tên xe cũng cần tiếng Việt
    plate_number = db.Column(db.String(20), nullable=False, unique=True)
    total_seats = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='ACTIVE')
    
    # New columns for real data
    img_url = db.Column(db.Unicode(500)) # Link ảnh
    rating = db.Column(db.Float, default=4.5)

    trips = db.relationship("Trip", back_populates="vehicle")

# 4. Routes
class Route(db.Model):
    __tablename__ = 'Routes'

    route_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    origin_station_id = db.Column(db.Integer, db.ForeignKey('Stations.station_id'), nullable=False)
    destination_station_id = db.Column(db.Integer, db.ForeignKey('Stations.station_id'), nullable=False)
    distance_km = db.Column(db.Numeric(10, 2))
    estimated_duration_minutes = db.Column(db.Integer)

    origin_station = db.relationship("Station", foreign_keys=[origin_station_id])
    destination_station = db.relationship("Station", foreign_keys=[destination_station_id])
    trips = db.relationship("Trip", back_populates="route")

# 5. Trips
class Trip(db.Model):
    __tablename__ = 'Trips'

    trip_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    route_id = db.Column(db.Integer, db.ForeignKey('Routes.route_id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('Vehicles.vehicle_id'), nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    base_price = db.Column(db.Numeric(15, 2), nullable=False)
    status = db.Column(db.String(20), default='SCHEDULED')

    route = db.relationship("Route", back_populates="trips")
    vehicle = db.relationship("Vehicle", back_populates="trips")
    bookings = db.relationship("Booking", back_populates="trip")

# 6. Bookings
class Booking(db.Model):
    __tablename__ = 'Bookings'

    booking_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('Trips.trip_id'), nullable=False)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Numeric(15, 2), nullable=False)
    status = db.Column(db.String(20), default='PENDING')
    note = db.Column(db.UnicodeText) # Ghi chú tiếng Việt

    user = db.relationship("User", back_populates="bookings")
    trip = db.relationship("Trip", back_populates="bookings")
    tickets = db.relationship("Ticket", back_populates="booking")
    payments = db.relationship("Payment", back_populates="booking")

# 7. Tickets
class Ticket(db.Model):
    __tablename__ = 'Tickets'

    ticket_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('Bookings.booking_id'), nullable=False) 
    passenger_name = db.Column(db.Unicode(100)) # Tên khách tiếng Việt
    price = db.Column(db.Numeric(15, 2), nullable=False)
    qr_code_data = db.Column(db.Text)
    seat_number = db.Column(db.String(10), nullable=True)
    booking = db.relationship("Booking", back_populates="tickets")

# 8. Payments
class Payment(db.Model):
    __tablename__ = 'Payments'

    payment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('Bookings.booking_id'), nullable=False)
    payment_method = db.Column(db.String(50))
    transaction_ref = db.Column(db.String(100))
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    payment_time = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='SUCCESS')

    booking = db.relationship("Booking", back_populates="payments")