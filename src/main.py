from docxtpl import DocxTemplate, RichText
import re
from typing import Dict
from settings import settings
import argparse



class File:
    def __init__(self, name: str, dist_dir: str):
        self.docx = DocxTemplate(settings.DIR_DATA / name)
        self.dist_dir = dist_dir
    
    def save_file(self, data) -> None:
        self.docx.render(context=data)
        self.docx.save(f"{settings.DIST_PATH}/{self.dist_dir}/cv.docx")
    
class LoadingInformation:
    def add_text_file(self, text: str) -> RichText:
        rt = RichText()
        words = re.split(r"(\*\*.*?\*\*)", text)

        for word in words:
            if word.startswith('**') and word.endswith('**'):
                rt.add(
                    word[2:-2], 
                    bold=True, 
                    font="eastAsia:Times New Roman",
                    size=16,
                    color="000000"
                )
                continue
            
            rt.add(
                word,
                font="eastAsia:Times New Roman",
                size=16,
                color="000000"
            )
            
        return rt
    
    def info(self, rt: RichText) -> Dict[str, RichText]:
        return {
            "RESUME": rt
        }

if __name__ == "__main__":

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--cv",
        required=True,
        choices=["portuguese.docx", "english.docx"],
        help="Argumento para saber qual o currículo será enviado as informações."
    )

    parser.add_argument(
        "--dir",
        required=True,
        choices=["Portuguese", "English"],
        help="Argumento para saber qual local será salvo o novo currículo."
    )

    parser.add_argument(
        "--info",
        required=True,
        help="Informações necessárias para incluir ao corpo do arquivo"
    )


    args = parser.parse_args()

    

    dist_dir = args.dir
    cv = args.cv
    info = args.info
  
    loading_information = LoadingInformation()

    rt = loading_information.add_text_file(info)
    data = loading_information.info(rt)

    file = File(
        name=cv,
        dist_dir=dist_dir
    )

    file.save_file(data)


   
    
