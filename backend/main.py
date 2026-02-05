from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

import models, schemas, crud, database

# Tự động tạo bảng DB khi chạy
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Cấu hình CORS (Để React gọi được)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CÁC API ---

# 1. API Tạo chuyến xe (POST)
@app.post("/trips", response_model=schemas.TripResponse)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(database.get_db)):
    return crud.create_trip(db=db, trip=trip)

# 2. API Xem danh sách chuyến (GET)
@app.get("/trips", response_model=List[schemas.TripResponse])
def read_trips(db: Session = Depends(database.get_db)):
    return crud.get_trips(db=db)

# 3. API Đặt vé (POST)
@app.post("/book")
def book_ticket(booking: schemas.BookingCreate, db: Session = Depends(database.get_db)):
    result = crud.create_booking(db=db, booking=booking)
    
    if result is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy chuyến xe")
    if result is False:
        raise HTTPException(status_code=400, detail="Hết vé rồi!")
        
    return {"message": "Đặt vé thành công!", "ticket": booking.seat_number}