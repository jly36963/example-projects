from orator import DatabaseManager, Schema, Model
from dotenv import load_dotenv
import os

load_dotenv(verbose=True)

databases = {
    'default': 'postgres',
    'postgres': {
        'driver': 'postgres',
        'host': os.getenv('PG_HOST'),
        'database': os.getenv('PG_DB'),
        'user': os.getenv('PG_USER'),
        'password': os.getenv('PG_PW'),
        'port': os.getenv('PG_PORT'),
        'prefix': ''
    }
}

db = DatabaseManager(databases)
schema = Schema(db)
Model.set_connection_resolver(db)
