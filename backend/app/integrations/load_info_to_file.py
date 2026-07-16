from jinja2 import Environment, FileSystemLoader
from pathlib import Path
from typing import Dict


class LoadInfoToFilePDFIntegration:

    def load_info(self, template: str, template_dir: Path, context: Dict) -> str: 
        env = Environment(loader=FileSystemLoader(template_dir))
        template = env.get_template(template)
        html = template.render(context)
        return html
    

__all__ = ["LoadInfoToFilePDFIntegration"]
