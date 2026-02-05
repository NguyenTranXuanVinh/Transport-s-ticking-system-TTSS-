from flask import Flask, jsonify
from flask_cors import CORS
from db_connection import get_db_connection

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/tickets', methods=['GET'])
def search_tickets():
    # Placeholder for DB connection
    # conn = get_db_connection()
    # if conn:
    #     cursor = conn.cursor()
    #     cursor.execute("SELECT * FROM Tickets")
    #     ...
    
    # Mock data (moved from frontend)
    tickets = [
        {
            "id": 1,
            "company": "Daiichi Travel",
            "rating": 4.8,
            "ratingCount": 408,
            "busType": "Sơ đồ 45 (Chuẩn)",
            "startTime": "08:00",
            "startStation": "Văn phòng 172 Trần Quang Khải",
            "endTime": "11:10",
            "endStation": "Văn phòng Cát Bà",
            "duration": "3h10m",
            "price": "250.000đ",
            "seatsLeft": 30,
            "image": "https://via.placeholder.com/200x150",
            "isInstant": True,
        },
        {
            "id": 2,
            "company": "Hải Phòng Travel",
            "rating": 4.5,
            "ratingCount": 120,
            "busType": "Limousine 9 chỗ",
            "startTime": "09:00",
            "startStation": "Bến xe Nước Ngầm",
            "endTime": "10:30",
            "endStation": "Bến xe Cầu Rào",
            "duration": "1h30m",
            "price": "200.000đ",
            "seatsLeft": 5,
            "image": "https://via.placeholder.com/200x150",
            "isInstant": False,
        },
        {
            "id": 3,
            "company": "Sao Việt",
            "rating": 4.2,
            "ratingCount": 85,
            "busType": "Giường nằm 40 chỗ",
            "startTime": "22:00",
            "startStation": "Bến xe Mỹ Đình",
            "endTime": "04:00",
            "endStation": "Sapa",
            "duration": "6h00m",
            "price": "350.000đ",
            "seatsLeft": 12,
            "image": "https://via.placeholder.com/200x150",
            "isInstant": True,
        },
    ]
    return jsonify(tickets), 200

@app.route('/api/test-db', methods=['GET'])
def test_db_connection():
    conn = get_db_connection()
    if conn:
        conn.close()
        return jsonify({"status": "success", "message": "Successfully connected to the database!"}), 200
    else:
        return jsonify({"status": "error", "message": "Failed to connect to the database."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
