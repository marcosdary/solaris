from abc import abstractmethod, ABC
from sqlalchemy.orm import Session

class BaseDB(ABC):

    @abstractmethod
    def get_session(self) -> Session: ...

    