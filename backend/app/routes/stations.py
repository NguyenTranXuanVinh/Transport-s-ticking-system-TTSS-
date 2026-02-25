from flask import Blueprint, jsonify
from models import Station

stations_bp = Blueprint('stations', __name__)

# 1. API Lấy danh sách bến xe
@stations_bp.route('/stations', methods=['GET'])
def get_stations():
    stations = Station.query.filter_by(is_active=True).all()
    result = [{
        "station_id": s.station_id,
        "station_name": s.station_name,
        "city": s.city,
        "address": s.address,
        "is_active": s.is_active
    } for s in stations]
    return jsonify(result)
