from databases import Database
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from .config import DB_URL

db_endpoint = str(DB_URL)
db_engine = create_engine(db_endpoint)
rdbms_session = sessionmaker(bind=db_engine)
Base = declarative_base()


def get_session() -> Session:
    db = rdbms_session()
    try:
        yield db
    finally:
        db.close()


# only use for first time of db setup
def create_tables():
    Base.metadata.create_all(db_engine)


def db_connection():
    return Database(db_endpoint)


class Connection(object):
    def __init__(self):
        self.db = db_connection()


connection = Connection()


class ServiceBase(object):
    def __init__(self, session: Session):
        self.session = session
