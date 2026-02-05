from pydantic import BaseModel

# --- Dữ liệu để TẠO chuyến đi (Frontend gửi lên) ---
class TripCreate(BaseModel):
    route: str
    price: float
    seats_left: int

# --- Dữ liệu để ĐẶT VÉ (Frontend gửi lên) ---
class BookingCreate(BaseModel):
    trip_id: int
    customer_name: str
    seat_number: str

# --- Dữ liệu để TRẢ VỀ (Backend trả về cho Frontend xem) ---
class TripResponse(TripCreate):
    id: int
    class Config:
        orm_mode = True