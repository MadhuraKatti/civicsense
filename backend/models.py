from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    ministry = Column(String)
    description = Column(String)
    benefit = Column(String)
    category = Column(String)
    deadline = Column(String)
    rules = Column(Text)          # stored as JSON string — works on both PG and SQLite
    apply_link = Column(String)
