from flask import Blueprint, request, jsonify
from models import Trip

trips_bp = Blueprint('trips', __name__)

def find_trip(t):
    v = t.vehicle
    return {
        "id": t.trip_id,
        "company": v.vehicle_name if v else "",
        "startTime": t.departure_time.strftime('%H:%M %d/%m') if t.departure_time else "",
        "endTime": t.arrival_time.strftime('%H:%M %d/%m') if t.arrival_time else "",
        "price": "{:,.0f}đ".format(t.base_price) if t.base_price else "0đ",
        "seatsLeft": v.total_seats if v else 0,
        "rating": (v and v.rating) or 0,
        "image": (v and v.img_url),
    }

@trips_bp.route('/trips', methods=['GET'])
def search_trips():
    trip_id = request.args.get('id')
    query = Trip.query.filter_by(trip_id=int(trip_id)) if trip_id else Trip.query
    trips = query.all()
    return jsonify([find_trip(t) for t in trips])
