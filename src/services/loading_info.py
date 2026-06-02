from docxtpl import RichText
import re

from typing import Dict

class LoadingInfoService:
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
