from abc import ABC, abstractmethod


class FileService(ABC):
    def __init__(self, basename: str):
        self._basename = basename
    
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
    

