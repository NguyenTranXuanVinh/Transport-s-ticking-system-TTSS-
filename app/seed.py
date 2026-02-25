from app import app
from extensions import db
from models import User, Station, Vehicle, Route, Trip
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

with app.app_context():
    print("⏳ Đang xóa dữ liệu cũ...")
    db.drop_all()
    db.create_all()

    print("⏳ Đang khởi tạo dữ liệu mẫu...")

    # 1. TẠO USERS (Admin & Khách hàng)
    # Cột: full_name, email, password_hash, phone_number, role
    admin = User(
        full_name="Administrator",
        email="admin@system.com",
        password_hash=generate_password_hash("123456"),
        phone_number="0900000001",
        role="ADMIN"
    )
    
    guest = User(
        full_name="Nguyễn Văn Khách",
        email="khach@gmail.com",
        password_hash=generate_password_hash("123456"),
        phone_number="0900000002",
        role="CUSTOMER"
    )
    
    db.session.add_all([admin, guest])
    db.session.commit()

    # 2. TẠO STATIONS (Bến xe)
    # Cột: station_name, city, address, is_active
    s1 = Station(station_name="Bến Mỹ Đình", city="Hà Nội", address="20 Phạm Hùng, Nam Từ Liêm")
    s2 = Station(station_name="Bến Đà Nẵng", city="Đà Nẵng", address="Trung tâm TP Đà Nẵng")
    s3 = Station(station_name="Bến Miền Đông", city="Hồ Chí Minh", address="Quận Bình Thạnh")
    s4 = Station(station_name="Bến Liên Tỉnh", city="Đà Lạt", address="01 Tô Hiến Thành")

    db.session.add_all([s1, s2, s3, s4])
    db.session.commit()

    # 3. TẠO VEHICLES (Xe)
    # Cột: vehicle_name, plate_number, total_seats, status
    v1 = Vehicle(vehicle_name="Limousine VIP 9 chỗ", plate_number="29B-123.45", total_seats=9, status="ACTIVE")
    v2 = Vehicle(vehicle_name="Xe Giường Nằm 40 chỗ", plate_number="51B-999.99", total_seats=40, status="ACTIVE")
    v3 = Vehicle(vehicle_name="Xe Ghế Ngồi 29 chỗ", plate_number="43B-567.89", total_seats=29, status="ACTIVE")

    db.session.add_all([v1, v2, v3])
    db.session.commit()
    
    # Tuyến 1: Hà Nội -> Đà Nẵng (760km, khoảng 14 tiếng = 840 phút)
    r1 = Route(
        origin_station_id=s1.station_id, 
        destination_station_id=s2.station_id, 
        distance_km=760.5, 
        estimated_duration_minutes=840
    )

    # Tuyến 2: HCM -> Đà Lạt (300km, khoảng 6 tiếng = 360 phút)
    r2 = Route(
        origin_station_id=s3.station_id, 
        destination_station_id=s4.station_id, 
        distance_km=308.0, 
        estimated_duration_minutes=360
    )

    # Tuyến 3: Hà Nội -> HCM (1700km, khoảng 30 tiếng = 1800 phút)
    r3 = Route(
        origin_station_id=s1.station_id, 
        destination_station_id=s3.station_id, 
        distance_km=1700.0, 
        estimated_duration_minutes=1800
    )

    db.session.add_all([r1, r2, r3])
    db.session.commit()

    # 5. TẠO TRIPS (Chuyến đi)
    depart_1 = datetime.now() + timedelta(days=1, hours=8)
    arrive_1 = depart_1 + timedelta(minutes=840)
    
    t1 = Trip(
        route_id=r1.route_id,
        vehicle_id=v1.vehicle_id,
        departure_time=depart_1,
        arrival_time=arrive_1,
        base_price=650000,
        status="SCHEDULED"
    )

    depart_2 = datetime.now() + timedelta(days=2, hours=22)
    arrive_2 = depart_2 + timedelta(minutes=360)

    t2 = Trip(
        route_id=r2.route_id,
        vehicle_id=v2.vehicle_id,
        departure_time=depart_2,
        arrival_time=arrive_2,
        base_price=300000,
        status="SCHEDULED"
    )

    db.session.add_all([t1, t2])
    db.session.commit()

    print("✅ XONG! Đã nạp dữ liệu thành công không lỗi lầm!")