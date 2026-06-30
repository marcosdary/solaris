from pathlib import Path
from jinja2 import Environment, FileSystemLoader

from typing import Dict

class LoadInfoToFilePDFService:
    def __init__(self, template_path: Path):
        self._template_path = template_path

    def load_info(self, template_name: str, context: Dict) -> str:
        env = Environment(loader=FileSystemLoader(self._template_path))
        template = env.get_template(template_name)
        html = template.render(context)
        return html
    
  