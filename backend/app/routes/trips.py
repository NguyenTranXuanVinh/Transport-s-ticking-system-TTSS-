from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from extensions import db
from models import Trip, Route, Station
from schemas import trips_schema, trip_schema

trips_bp = Blueprint('trips', __name__)

# 2. API Tìm chuyến xe
@trips_bp.route('/trips', methods=['GET'])
def search_trips():
    vehicle_id = request.args.get('vehicle_id')
    trip_id = request.args.get('id')

    query = Trip.query

    if vehicle_id:
        query = query.filter(Trip.vehicle_id == vehicle_id)
    
    if trip_id:
        query = query.filter(Trip.id == trip_id)

    trips = query.all()
    return jsonify(trips_schema.dump(trips))

# 3. API Thêm chuyến xe mới
@trips_bp.route('/trips', methods=['POST'])
def create_trip():
    data = request.get_json()
    
    try:
        # Parse datetime strings
        departure_time = datetime.strptime(data['departure_time'], '%Y-%m-%d %H:%M:%S')
        arrival_time = datetime.strptime(data['arrival_time'], '%Y-%m-%d %H:%M:%S')
        
        new_trip = Trip(
            route_id=data['route_id'],
            vehicle_id=data['vehicle_id'],
            departure_time=departure_time,
            arrival_time=arrival_time,
            base_price=data['base_price'],
            status=data.get('status', 'SCHEDULED')
        )
        
        db.session.add(new_trip)
        db.session.commit()
        
        return jsonify(trip_schema.dump(new_trip)), 201
        
    except (ValueError, KeyError) as e:
        return jsonify({"error": str(e)}), 400
