import os

class Config:
    SQLALCHEMY_DATABASE_URI = (
        "mssql+pyodbc://sa:123456@localhost\\SQLEXPRESS2025/TicketBookingSystem"
        "?driver=ODBC+Driver+17+for+SQL+Server&TrustServerCertificate=yes"
    )
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_AS_ASCII = False