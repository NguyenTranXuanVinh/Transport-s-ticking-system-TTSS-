from flask import Blueprint, request, jsonify

from extensions import db
from models import Trip, Vehicle

trips_bp = Blueprint('trips', __name__)

# 2. API Tìm chuyến xe
@trips_bp.route('/trips', methods=['GET'])
def search_trips():
    trip_id = request.args.get('id')
    query = Trip.query

    if trip_id:
        query = query.filter(Trip.trip_id == trip_id)

    trips = query.all()

    result = [{
        "id": t.trip_id,
        "company": t.vehicle.vehicle_name if t.vehicle else "Nhà xe TTSS",
        "startTime": t.departure_time.strftime('%H:%M %d/%m') if t.departure_time else "",
        "endTime": t.arrival_time.strftime('%H:%M %d/%m') if t.arrival_time else "",
        "price": "{:,.0f}đ".format(t.base_price) if t.base_price else "0đ",
        "seatsLeft": t.vehicle.total_seats if t.vehicle else 0,
        "rating": t.vehicle.rating if t.vehicle and t.vehicle.rating else 0,
        "ratingCount": t.vehicle.rating_count if t.vehicle and t.vehicle.rating_count is not None else 0,
        "isInstant": False,
        "image": t.vehicle.image_url if t.vehicle and t.vehicle.image_url else "https://via.placeholder.com/300x200?text=No+Image"
    } for t in trips]

    return jsonify(result)
