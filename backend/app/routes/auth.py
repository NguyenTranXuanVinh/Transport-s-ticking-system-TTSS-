from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

# API Đăng ký (Register)
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json or {}

    # Kiểm tra các trường bắt buộc
    if not data.get('email'):
        return jsonify({"message": "Vui lòng nhập email"}), 400
    if not data.get('password'):
        return jsonify({"message": "Vui lòng nhập mật khẩu"}), 400
    if not data.get('full_name'):
        return jsonify({"message": "Vui lòng nhập họ và tên"}), 400

    # Kiểm tra xem đã có email trong database hay chưa
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email đã tồn tại"}), 400

    # Mã hóa mật khẩu
    hashed_pass = generate_password_hash(data['password'])

    # Tạo 1 user mới
    new_user = User(
        full_name=data['full_name'],
        email=data['email'],
        password_hash=hashed_pass,
        phone_number=data.get('phone_number', ''),
        role='CUSTOMER'
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Đăng ký thành công"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Lỗi hệ thống hoặc lỗi dữ liệu. Vui lòng kiểm tra lại thông tin."}), 500

# API Đăng nhập (Login)
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    #Kiểm tra xem email đã tồn tại trong hệ thống hay chua
    user = User.query.filter_by(email=data.get('email')).first()

    #Nếu email không tồn tại hoặc sai mật khẩu
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"message": "Sai email hoặc mật khẩu"}), 401

    #Nếu đúng email và mật khẩu
    return jsonify({
        "message": "Đăng nhập thành công",
        "user_id": user.user_id,
        "name": user.full_name,
        "email": user.email,
        "phone_number": user.phone_number or "",
        "role": user.role
    })

# API Cập nhật thông tin (Update Profile)
@auth_bp.route('/update-profile/<int:user_id>', methods=['PUT'])
def update_profile(user_id):
    #Tìm user theo ID, nếu không tồn tại trả về 404 tự động
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"message": "Người dùng không tồn tại"}), 404
    data = request.json

    #Cập nhật họ tên nếu có gửi lên
    if 'full_name' in data:
        user.full_name = data['full_name']

    #Cập nhật số điện thoại nếu có gửi lên
    if 'phone_number' in data:
        user.phone_number = data['phone_number']

    #Cập nhật email nếu có gửi lên
    if 'email' in data:
        #Kiểm tra email mới có bị trùng với user khác không
        existing = User.query.filter_by(email=data['email']).first()
        if existing and existing.user_id != user_id:
            return jsonify({"message": "Email đã được sử dụng bởi tài khoản khác"}), 400
        user.email = data['email']

    #Cập nhật mật khẩu nếu có gửi lên
    if 'password' in data:
        user.password_hash = generate_password_hash(data['password'])

    #Lưu thay đổi vào database
    db.session.commit()
    return jsonify({
        "message": "Cập nhật thông tin thành công",
        "user_id": user.user_id,
        "full_name": user.full_name,
        "email": user.email,
        "phone_number": user.phone_number
    }), 200
