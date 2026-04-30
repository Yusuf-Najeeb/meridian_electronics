from typing import Generator
from sqlalchemy.orm import Session
from config.db import get_db
from fastapi import Depends

def get_db_session() -> Generator[Session, None, None]:
    yield from get_db()

# Shorthand for route signatures
DBSession = Depends(get_db_session)