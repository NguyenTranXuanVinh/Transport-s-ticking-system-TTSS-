import pyodbc

def get_db_connection():
    # Check available drivers
    drivers = [x for x in pyodbc.drivers() if 'SQL Server' in x]
    print(f"Available SQL Server Drivers: {drivers}")
    
    driver = drivers[0] if drivers else 'SQL Server'
    # driver = 'SQL Server' # Fallback to generic if needed

    servers = ['.', 'localhost', r'.\MSSQLSERVER', '(local)']
    
    for server in servers:
        print(f"Trying to connect to server: {server} with driver: {driver}")
        try:
            # Try to connect to master or default db first
            conn = pyodbc.connect(
                f'DRIVER={{{driver}}};'
                f'SERVER={server};'
                'Trusted_Connection=yes;',
                timeout=2
            )
            print(f"Successfully connected to {server}")
            
            # Check for database
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sys.databases WHERE name = 'TicketBookingSystem'")
            row = cursor.fetchone()
            if row:
                print("Database 'TicketBookingSystem' found!")
                # Reconnect specifically to the database
                conn.close()
                conn = pyodbc.connect(
                    f'DRIVER={{{driver}}};'
                    f'SERVER={server};'
                    'DATABASE=TicketBookingSystem;'
                    'Trusted_Connection=yes;'
                )
                return conn
            else:
                print("Database 'TicketBookingSystem' NOT found on this server.")
                # List all dbs
                cursor.execute("SELECT name FROM sys.databases")
                dbs = [r[0] for r in cursor.fetchall()]
                print(f"Available databases: {dbs}")
                conn.close()
        except Exception as e:
            print(f"Failed to connect to {server}: {e}")
    
    return None

if __name__ == "__main__":
    conn = get_db_connection()
    if conn:
        print("Final Result: Successfully connected to the TicketBookingSystem database!")
        conn.close()
    else:
        print("Final Result: Failed to connect to any server or find the database.")
