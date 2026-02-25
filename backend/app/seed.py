from app import app
from extensions import db
from models import Station, Route, Vehicle, Trip
from datetime import datetime, timedelta

def seed_data():
    with app.app_context():
        # 1. Tạo lại bảng nếu chưa có (Tránh lỗi thiếu cột image_url)
        db.create_all()
        
        # Kiểm tra xem có dữ liệu chưa, nếu có rồi thì thôi không nạp nữa
        if Station.query.first():
            print("Database da co du lieu. Khong can nap them!")
            return

        print("Dang nap du lieu mau...")

        # 2. Tạo Bến xe (Stations)
        s1 = Station(station_name=u"Bến xe Mỹ Đình", city=u"Hà Nội", address=u"20 Phạm Hùng, Mỹ Đình")
        s2 = Station(station_name=u"Bến xe Miền Đông", city=u"Hồ Chí Minh", address=u"292 Đinh Bộ Lĩnh, Bình Thạnh")
        s3 = Station(station_name=u"Bến xe Đà Nẵng", city=u"Đà Nẵng", address=u"Tôn Đức Thắng, Liên Chiểu")
        
        db.session.add_all([s1, s2, s3])
        db.session.commit()

        # 3. Tạo Xe (Vehicles) - Đầy đủ cột mới image_url, rating
        v1 = Vehicle(
            vehicle_name=u"Limousine VIP 34 Phòng", 
            plate_number="29B-12345", 
            total_seats=34, 
            status="ACTIVE",
            image_url="https://vexere.com/images/vehicle-default.png", # Link ảnh mẫu
            rating=4.8,
            rating_count=150
        )
        v2 = Vehicle(
            vehicle_name=u"Xe Giường Nằm Thaco", 
            plate_number="51B-99999", 
            total_seats=40, 
            status="ACTIVE",
            image_url="https://vexere.com/images/vehicle-default.png",
            rating=4.5,
            rating_count=80
        )
        
        db.session.add_all([v1, v2])
        db.session.commit()

        # 4. Tạo Tuyến đường (Routes)
        # Hà Nội (ID 1) -> Đà Nẵng (ID 3)
        r1 = Route(origin_station_id=s1.station_id, destination_station_id=s3.station_id, distance_km=760, estimated_duration_minutes=840)
        # Đà Nẵng (ID 3) -> Sài Gòn (ID 2)
        r2 = Route(origin_station_id=s3.station_id, destination_station_id=s2.station_id, distance_km=960, estimated_duration_minutes=1000)
        
        db.session.add_all([r1, r2])
        db.session.commit()

        # 5. Tạo Chuyến đi (Trips) - QUAN TRỌNG: Giờ chạy là TƯƠNG LAI (Ngày mai)
        tomorrow = datetime.now() + timedelta(days=1) # Lấy giờ hiện tại cộng thêm 1 ngày
        departure_time = tomorrow.replace(hour=8, minute=0, second=0) # 8h sáng mai
        arrival_time = departure_time + timedelta(hours=14) # Chạy 14 tiếng

        t1 = Trip(
            route_id=r1.route_id, 
            vehicle_id=v1.vehicle_id, 
            departure_time=departure_time, 
            arrival_time=arrival_time, 
            base_price=450000, 
            status="SCHEDULED"
        )
        
        t2 = Trip(
            route_id=r2.route_id, 
            vehicle_id=v2.vehicle_id, 
            departure_time=departure_time, 
            arrival_time=arrival_time, 
            base_price=550000, 
            status="SCHEDULED"
        )

        db.session.add_all([t1, t2])
        db.session.commit()
        
        print("Nap du lieu thanh cong! (Chuyen xe da duoc set lich vao ngay mai)")

if __name__ == "__main__":
    seed_data()