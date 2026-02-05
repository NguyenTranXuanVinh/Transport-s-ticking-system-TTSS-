from extensions import ma
from models import Station, Trip

class StationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Station

class TripSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Trip
    
    # Mapping fields to match Frontend expectations
    # Mapping fields to match Frontend expectations
    id = ma.Function(lambda obj: obj.trip_id)
    company = ma.Function(lambda obj: obj.vehicle.vehicle_name if obj.vehicle else "Nhà xe TTSS")
    startTime = ma.Function(lambda obj: obj.departure_time.strftime('%H:%M %d/%m'))
    endTime = ma.Function(lambda obj: obj.arrival_time.strftime('%H:%M %d/%m'))
    price = ma.Function(lambda obj: "{:,.0f}đ".format(obj.base_price) if obj.base_price else "0đ")
    seatsLeft = ma.Function(lambda obj: obj.vehicle.total_seats if obj.vehicle else 0) 
    
    # Lấy dữ liệu thật từ DB (Vehicle)
    rating = ma.Function(lambda obj: obj.vehicle.rating if obj.vehicle and obj.vehicle.rating else 0)
    ratingCount = ma.Function(lambda obj: obj.vehicle.rating_count if obj.vehicle and obj.vehicle.rating_count is not None else 0)
    
    isInstant = ma.Function(lambda obj: False) # Tắt tag xác nhận tức thì
    
    # Custom các trường dữ liệu trả về cho đẹp (Giữ lại nếu cần debug)
    start_time = ma.Function(lambda obj: obj.departure_time.strftime('%H:%M %d/%m/%Y'))
    
    vehicle_name = ma.Function(lambda obj: obj.vehicle.vehicle_name if obj.vehicle else "Đang cập nhật")
    origin = ma.Function(lambda obj: obj.route.origin_station.city if obj.route and obj.route.origin_station else "")
    destination = ma.Function(lambda obj: obj.route.destination_station.city if obj.route and obj.route.destination_station else "")
    
    # Hình ảnh thật từ DB
    image = ma.Function(lambda obj: obj.vehicle.image_url if obj.vehicle and obj.vehicle.image_url else "https://via.placeholder.com/300x200?text=No+Image")

trip_schema = TripSchema()
trips_schema = TripSchema(many=True)
station_schema = StationSchema()
stations_schema = StationSchema(many=True)
