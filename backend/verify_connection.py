import psycopg2
from urllib.parse import urlparse
import os
from dotenv import load_dotenv

load_dotenv()

def test_direct_connection():
    try:
        # Parse the DATABASE_URL
        url = urlparse(os.getenv("DATABASE_URL"))
        
        # Extract connection parameters
        dbname = url.path[1:]  # Remove leading slash
        user = url.username
        password = url.password
        host = url.hostname
        port = url.port

        # Try to connect
        print("Attempting to connect to database...")
        conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port,
            sslmode='require',
            connect_timeout=30
        )
        
        print("Successfully connected to database!")
        
        # Test query
        cur = conn.cursor()
        cur.execute('SELECT version();')
        ver = cur.fetchone()
        print(f"PostgreSQL version: {ver[0]}")
        
        # Close connection
        cur.close()
        conn.close()
        print("Connection closed successfully")
        return True
        
    except Exception as e:
        print(f"Connection error: {str(e)}")
        return False

if __name__ == "__main__":
    test_direct_connection() 