from docxtpl import RichText
import re

from typing import Dict

class LoadInfoToFileService:
    def load_info(self, text: str) -> RichText:
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
    
    def payload_from_rich(self, text: str) -> Dict[str, RichText]:
        rich = self.load_info(text)
        return {
            "RESUME": rich
        }
