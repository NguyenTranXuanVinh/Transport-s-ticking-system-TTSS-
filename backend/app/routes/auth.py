from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

# 3. API Đăng ký (Register)
@auth_bp.route('/register', methods=['POST'])
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
@auth_bp.route('/login', methods=['POST'])
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
