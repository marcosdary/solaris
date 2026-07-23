import hmac
import hashlib
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

class AuthenticatorUtil:
    """Classe utilitária para hash e verificação de senhas usando Argon2id + Pepper.

    Argon2id é o padrão atual mais seguro, resistente a ataques de GPU e ASIC 
    devido ao seu alto consumo de memória. O Pepper adiciona uma camada de 
    segurança caso apenas o banco de dados seja comprometido.
    """
    def __init__(self, pepper: str) -> None:
        self._pepper = pepper
    
    # Configuração do Argon2 (pode-se ajustar tempo, memória e paralelismo)
    _ph = PasswordHasher(
        time_cost=3,         # Número de iterações
        memory_cost=65536,   # 64 MB de memória RAM necessária por hash
        parallelism=4        # Número de threads
    )

    def _apply_pepper(self, password: str) -> str:
        """Aplica o pepper na senha usando HMAC-SHA256.
        
        Transforma a senha original em um hash HMAC antes de passá-la para o Argon2.
        Isso garante que a senha real nunca passe diretamente pelo algoritmo de hash.
        """
        # Cria um hash HMAC usando a senha e o pepper
        peppered_bytes = hmac.new(
            self._pepper.encode('utf-8'), 
            password.encode('utf-8'), 
            hashlib.sha256
        ).hexdigest()
        return peppered_bytes

    def hash_password(self, password: str) -> str:
        """Gera um hash seguro para a senha usando Argon2id e Pepper.

        Args:
            password (str): Senha em texto plano.

        Returns:
            str: Hash da senha seguro para armazenar no banco.
        """
        # 1. Aplica o pepper (HMAC)
        peppered_password = self._apply_pepper(password)
        
        # 2. Gera o hash com Argon2 (ele gera o salt automaticamente)
        return self._ph.hash(peppered_password)
    
    def verify_password(self, plain: str, hashed: str) -> bool:
        """Verifica se uma senha em texto plano corresponde ao hash Argon2.

        Args:
            plain (str): Senha em texto plano.
            hashed (str): Hash armazenado no banco.

        Returns:
            bool: True se for válida, False caso contrário.
        """
        # 1. Aplica o mesmo pepper na senha que o usuário digitou
        peppered_password = self._apply_pepper(plain)
        
        # 2. Verifica contra o hash armazenado
        try:
            return self._ph.verify(hashed, peppered_password)
        except VerifyMismatchError:
            return False
        except Exception:
            # Caso o hash esteja corrompido ou em formato inválido
            return False
        
    def needs_rehash(self, hashed: str) -> bool:
        """Verifica se o hash precisa ser atualizado (ex: parâmetros ficaram fracos).
        
        Útil para migrar usuários antigos de bcrypt para argon2 gradualmente.
        """
        return self._ph.check_needs_rehash(hashed)