import os

class Config:
    SQLALCHEMY_DATABASE_URI = (
    "mssql+pyodbc://@localhost\\SQLEXPRESS/TicketBookingSystem"
    "?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_AS_ASCII = False