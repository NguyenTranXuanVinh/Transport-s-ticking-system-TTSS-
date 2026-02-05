from flask import Blueprint, request, jsonify
from extensions import db
from models import Trip, Route, Station
from schemas import trips_schema, trip_schema

trips_bp = Blueprint('trips', __name__)

# 2. API Tìm chuyến xe
@trips_bp.route('/trips', methods=['GET'])
def search_trips():
    destination = request.args.get('destination')
    sort_by = request.args.get('sort')
    vehicle_id = request.args.get('vehicle_id') # Thêm lọc theo vehicle_id

    query = Trip.query.join(Route).join(Station, Route.destination_station_id == Station.station_id)

    if destination:
        query = query.filter(Station.city.like(f"%{destination}%"))
    
    if vehicle_id:
        query = query.filter(Trip.vehicle_id == vehicle_id)

    # Logic sắp xếp
    if sort_by == 'price_asc':
        query = query.order_by(Trip.base_price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Trip.base_price.desc())
    elif sort_by == 'time_asc':
        query = query.order_by(Trip.departure_time.asc())

    trips = query.all()
    return jsonify(trips_schema.dump(trips))

# API Tạo chuyến xe
@trips_bp.route('/trips', methods=['POST'])
def create_trip():
    data = request.json
    # Lưu ý: Cần route_id, vehicle_id, departure_time, arrival_time...
    new_trip = Trip(
        route_id=data.get('route_id', 1), # Default 1
        vehicle_id=data.get('vehicle_id', 1), # Default 1
        departure_time=data.get('departure_time', '2023-10-20 08:00:00'),
        arrival_time=data.get('arrival_time', '2023-10-20 12:00:00'),
        base_price=data.get('price', 100000),
        status='SCHEDULED'
    )
    db.session.add(new_trip)
    db.session.commit()
    return jsonify(trip_schema.dump(new_trip)), 201
