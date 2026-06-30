"""
Script para gerar um currículo .docx usando o template dinâmico
portuguese-melhorado.docx e os schemas Pydantic.

Uso:
    python3 gerar_docx.py

Gera um arquivo .docx em backend/data/ com o nome
cv_<nome>_<timestamp>.docx
"""
from uuid import uuid4

from pathlib import Path
from datetime import datetime
from typing import Dict, Any

from docxtpl import DocxTemplate
from app.schemas import StructuredCVRequestSchema



# ──────────────────────────────────────────────────────────────────────
# DADOS DE EXEMPLO (podem ser substituídos por entrada real)
# ──────────────────────────────────────────────────────────────────────

def example_data() -> StructuredCVRequestSchema:
    """Retorna um conjunto de dados de exemplo para testar o template."""
    return StructuredCVRequestSchema(
        name="João Silva Santos",
        email="joao.silva@email.com",
        linkedin="linkedin.com/in/joaosilva",
        phone="(11) 99999-8888",
        location="São Paulo, SP - Brazil",
        resume=(
            "Profissional com 6 anos de experiência em desenvolvimento "
            "de software, especializado em **Python**, **FastAPI** e "
            "**React**. Experiência em liderança técnica e arquitetura "
            "de sistemas distribuídos."
        ),
        experiences=[
            {
                "role": "Engenheiro de Software Sênior",
                "company": "TechCorp Soluções",
                "period": "Jan 2023 – Presente",
                "location": "São Paulo, SP",
                "activities": [
                    "Liderou migração de monólito para microsserviços",
                    "Implementou pipelines CI/CD com GitHub Actions",
                    "Mentoria de 3 desenvolvedores juniores",
                ],
            },
            {
                "role": "Desenvolvedor Backend",
                "company": "StartupInovadora",
                "period": "Mar 2021 – Dez 2022",
                "location": "Remoto",
                "activities": [
                    "Desenvolveu APIs REST com FastAPI e PostgreSQL",
                    "Criou sistema de autenticação JWT",
                    "Reduziu latência de consultas em 40%",
                ],
            },
        ],
        educations=[
            {
                "institution": "Universidade de São Paulo",
                "degree": "Ciência da Computação",
                "period": "Fev 2017 – Dez 2022",
                "location": "São Paulo, SP",
            },
        ],
        projects=[
            {
                "name": "Sistema de Agendamento Online",
                "description": (
                    "Plataforma completa de agendamento para clínicas "
                    "com calendário integrado e notificações"
                ),
                "period": "2023",
                "technologies": ["FastAPI", "React", "PostgreSQL", "Docker"],
            },
        ],
        certifications=[
            {
                "institution": "AWS",
                "name": "AWS Certified Solutions Architect",
                "period": "2024",
                "location": "Remoto",
            },
            {
                "institution": "Simplilearn",
                "name": "Docker Orchestration and Security",
                "period": "2024",
                "location": "Remoto",
            },
        ],
    )





# ──────────────────────────────────────────────────────────────────────
# EXECUÇÃO
# ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Caminhos
    DIR_BASE = Path(__file__).parent
    TEMPLATE_PATH = DIR_BASE / "data" / "clt.docx"
    TEMPLATE_UPLOAD = DIR_BASE / "data" / "uploads" / "docx" / "response.docx"

    context = example_data().model_dump()

    doc = DocxTemplate(TEMPLATE_PATH)
    doc.render(context)

    doc.save(TEMPLATE_UPLOAD)
    print(f"Tentativa: {uuid4()} Data ISO: {datetime.now().isoformat()}")
