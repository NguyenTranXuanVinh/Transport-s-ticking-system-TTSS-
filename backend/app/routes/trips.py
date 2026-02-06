from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from extensions import db
from models import Trip, Route, Station, Vehicle
from schemas import trips_schema, trip_schema

trips_bp = Blueprint('trips', __name__)

# 2. API Tìm chuyến xe
@trips_bp.route('/trips', methods=['GET'])
def search_trips():
    trip_id = request.args.get('id')
    from_city = request.args.get('from')
    to_city = request.args.get('to')
    date_str = request.args.get('date')

    query = Trip.query

    if trip_id:
        # Xử lý ID: xóa khoảng trắng thừa và ép kiểu string để so sánh an toàn
        query = query.filter(Trip.trip_id == trip_id.strip())

    # Khôi phục các bộ lọc khác nếu cần sau này, hiện tại tập trung vào ID theo yêu cầu
    if from_city:
        query = query.join(Route).join(Station, Route.origin_station_id == Station.station_id)
        query = query.filter(Route.origin_station.has(Station.city.ilike(f"%{from_city}%")))
        
    if to_city:
        if not from_city: # Tránh join 2 lần nếu đã join ở trên
             query = query.join(Route).join(Station, Route.destination_station_id == Station.station_id)
        query = query.filter(Route.destination_station.has(Station.city.ilike(f"%{to_city}%")))

    if date_str:
        try:
            search_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            query = query.filter(db.func.date(Trip.departure_time) == search_date)
        except ValueError:
            pass

    trips = query.all()

    return jsonify(trips_schema.dump(trips))
            

