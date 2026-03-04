class Config:
    SQLALCHEMY_DATABASE_URI = (
        "mssql+pyodbc://doanbarin%40gmail.com"
        "@transporhikari.database.windows.net/Transport System"
        "?driver=ODBC+Driver+17+for+SQL+Server"
        "&Authentication=ActiveDirectoryInteractive"
        "&Encrypt=yes"
        "&TrustServerCertificate=no"
    )   
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_AS_ASCII = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": False,
        "pool_recycle": 3600,
    }