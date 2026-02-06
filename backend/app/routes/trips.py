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

    query = Trip.query

    if trip_id:
        query = query.filter(Trip.trip_id == trip_id)

    trips = query.all()
            
    return jsonify(trips_schema.dump(trips))
            
    return jsonify(trips_schema.dump(trips))
