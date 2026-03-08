from flask import Blueprint, request, jsonify
from models import Trip
from extensions import db
from routes.utils import get_booked_seats

trips_bp = Blueprint('trips', __name__)

def find_trip(t):
    v = t.vehicle
    total = v.total_seats if v else 0
    booked = get_booked_seats(t.trip_id)
    return {
        "id": t.trip_id,
        "company": v.vehicle_name if v else "",
        "startTime": t.departure_time.strftime('%H:%M %d/%m') if t.departure_time else "",
        "endTime": t.arrival_time.strftime('%H:%M %d/%m') if t.arrival_time else "",
        "price": "{:,.0f}đ".format(t.base_price) if t.base_price else "0đ",
        "seatsLeft": max(0, total - booked),
        "rating": (v and v.rating) or 0,
        "image": (v and v.img_url),
    }

@trips_bp.route('/trips', methods=['GET'])
def search_trips():
    trip_id = request.args.get('id')
    if trip_id:
        trips = Trip.query.filter(Trip.trip_id == int(trip_id)).all()
    else:
        seen = set()
        trips = []
        for t in sorted(Trip.query.all(), key=lambda x: x.trip_id):
            if t.trip_id not in seen:
                seen.add(t.trip_id)
                trips.append(t)
    return jsonify([find_trip(t) for t in trips])
