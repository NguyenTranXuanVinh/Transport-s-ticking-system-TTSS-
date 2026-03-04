from flask import Flask, jsonify
from config import Config
from extensions import db, cors
from routes.auth import auth_bp
from routes.stations import stations_bp
from routes.trips import trips_bp
from routes.bookings import bookings_bp


app = Flask(__name__)
app.config.from_object(Config)

#CẤU HÌNH HIỂN THỊ TIẾNG VIỆT
app.json.ensure_ascii = False 

# Kết nối các thành phần
db.init_app(app)

cors.init_app(app)

# Đăng ký Blueprints (Routes)
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(stations_bp, url_prefix='/api')
app.register_blueprint(trips_bp, url_prefix='/api')
app.register_blueprint(bookings_bp, url_prefix='/api')


# 0. Health Check
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Backend is running"})

if __name__ == '__main__':
    with app.app_context():
        print("Server ready")
    app.run(debug=True, port=5000)