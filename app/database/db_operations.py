from typing import List, Optional, Type

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import DatabaseError

Base = declarative_base()


class DbOperations:
    def __init__(self, model: Type, db_url: str):
        self.model = model
        self.engine = create_engine(f"sqlite:///{db_url}")
        Base.metadata.create_all(self.engine)
        self._session = None

    @property
    def session(self):
        if self._session is None:
            self._session = sessionmaker(bind=self.engine, autoflush=False, autocommit=False)()
        return self._session
    
    def create(self, **kwargs) -> Optional[Base]:
        """Create a new record in the database."""
        try:
            instance = self.model(**kwargs)
            self.session.add(instance)
            self.session.commit()
            self.session.refresh(instance)
            print(f"Created: {instance}")
        except DatabaseError:
            self.session.rollback()
            return None
        return f'{instance.id} row inserted successfully.'
    
    def read_all(self) -> List[Base]:
        """Read all records from the database."""
        return self.session.query(self.model).all()
    
    def read_by_id(self, record_id: int) -> Optional[Base]:
        """Read a record by its ID."""
        return self.session.query(self.model).filter(self.model.id == record_id).first()
    
    def close(self):
        """Close the database session."""
        if self._session:
            self._session.close()