from flask import Blueprint, jsonify
from models import Station
from schemas import stations_schema

stations_bp = Blueprint('stations', __name__)

# 1. API Lấy danh sách bến xe
@stations_bp.route('/stations', methods=['GET'])
def get_stations():
    stations = Station.query.filter_by(is_active=True).all()
    # Dùng stations_schema đã khai báo ở trên
    return jsonify(stations_schema.dump(stations))
