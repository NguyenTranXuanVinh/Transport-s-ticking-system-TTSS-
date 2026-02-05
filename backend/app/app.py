from flask import Flask, request, jsonify
from config import Config
from extensions import db, ma, cors
from models import User, Station, Trip, Route, Vehicle
from werkzeug.security import generate_password_hash, check_password_hash
import random

app = Flask(__name__)
app.config.from_object(Config)

# 👇 CẤU HÌNH HIỂN THỊ TIẾNG VIỆT
app.json.ensure_ascii = False 

# Kết nối các thành phần
db.init_app(app)
ma.init_app(app)
cors.init_app(app)

# --- SCHEMAS (Quy định dữ liệu trả về) ---
class StationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Station

class TripSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Trip
    
    # Custom các trường dữ liệu trả về cho đẹp
    start_time = ma.Function(lambda obj: obj.departure_time.strftime('%H:%M %d/%m/%Y'))
    
    # Sửa lại: Lấy từ base_price (do model bạn đặt tên là base_price)
    price = ma.Function(lambda obj: int(obj.base_price) if obj.base_price else 0)
    
    vehicle_name = ma.Function(lambda obj: obj.vehicle.vehicle_name if obj.vehicle else "Đang cập nhật")
    origin = ma.Function(lambda obj: obj.route.origin_station.city if obj.route and obj.route.origin_station else "")
    destination = ma.Function(lambda obj: obj.route.destination_station.city if obj.route and obj.route.destination_station else "")
    
    # Hình ảnh giả lập
    image = ma.Function(lambda obj: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop")

# 👇 DÒNG BẠN BỊ THIẾU NÈ 👇
trip_schema = TripSchema()
trips_schema = TripSchema(many=True)
station_schema = StationSchema()
stations_schema = StationSchema(many=True) 
# ---------------------------

# ==================== CÁC API CHỨC NĂNG ====================

# 0. Trang chủ
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Server đang chạy ngon lành! Hãy thử vào /api/stations"})

# 1. API Lấy danh sách bến xe
@app.route('/api/stations', methods=['GET'])
def get_stations():
    stations = Station.query.filter_by(is_active=True).all()
    # Dùng stations_schema đã khai báo ở trên
    return jsonify(stations_schema.dump(stations))

# 2. API Tìm chuyến xe
@app.route('/api/trips', methods=['GET'])
def search_trips():
    destination = request.args.get('destination') # Lấy tham số tìm kiếm
    sort_by = request.args.get('sort')

    query = Trip.query.join(Route).join(Station, Route.destination_station_id == Station.station_id)

    if destination:
        query = query.filter(Station.city.like(f"%{destination}%"))

    # Logic sắp xếp
    if sort_by == 'price_asc':
        query = query.order_by(Trip.base_price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Trip.base_price.desc())
    elif sort_by == 'time_asc':
        query = query.order_by(Trip.departure_time.asc())

    trips = query.all()
    return jsonify(trips_schema.dump(trips))

# 3. API Đăng ký (Register)
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"message": "Email đã tồn tại"}), 400
    
    hashed_pass = generate_password_hash(data['password'])
    # Lưu ý: Model User của bạn yêu cầu full_name, email, password_hash
    new_user = User(
        full_name=data['full_name'], 
        email=data['email'], 
        password_hash=hashed_pass,
        phone_number=data.get('phone_number', ''),
        role='CUSTOMER'
    )
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Đăng ký thành công"}), 201

# 4. API Đăng nhập (Login)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get('email')).first()

    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"message": "Sai email hoặc mật khẩu"}), 401
    
    return jsonify({
        "message": "Đăng nhập thành công",
        "user_id": user.user_id,
        "name": user.full_name,
        "role": user.role
    })

# --- CHẠY SERVER ---
if __name__ == '__main__':
    with app.app_context():
        # Không cần create_all nữa vì đã có seed.py lo rồi
        print("✅ Server đã sẵn sàng!")
    app.run(debug=True, port=5000)