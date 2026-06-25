from abc import ABC, abstractmethod
from uuid import uuid4


class FileService(ABC):
    def __init__(self):
        self._basename = f"cv_{uuid4()}"
    
    @property
    @abstractmethod
    def filename(self): ...
    
    @property
    @abstractmethod
    def mimetype(self): ...

    @property
    @abstractmethod
    def path(self): ...
    
    @abstractmethod
    def save(self) -> None: ...
    

