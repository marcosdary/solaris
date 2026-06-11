from os import remove

def delete_files(paths: list[str]):
    for path in paths:
        try:
            remove(path)
        except Exception as exc:
            print(f"Erro ao deletar o arquivo: {exc}")