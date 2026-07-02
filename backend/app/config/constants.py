from enum import Enum
from pathlib import Path

class TemplateFile(Enum):
    english = "english.docx"
    portuguese = "portuguese.docx"
    resume_docx = "resume.docx"
    standard = "standard.html"
    modern = "modern.html"

class Language(Enum):
    english = "english"
    portuguese = "portuguese"
    spanish = "spanish"

class DirPaths(Enum):
    BASE_DIR =  Path(__file__).parent.parent.parent
    DIR_UPLOAD = Path(__file__).parent.parent.parent / "data" / "uploads" 
    DIR_FILES_TEMP = Path(__file__).parent.parent.parent / "data" / "temp"
    DIR_TEMPLATES = Path(__file__).parent.parent.parent / "templates"

class TypeFolder(Enum):
    PDF = "pdf"
    DOCX = "docx"
class CVCategory(str, Enum):
    # Tecnologia
    backend_developer = "backend_developer"
    frontend_developer = "frontend_developer"
    fullstack_developer = "fullstack_developer"
    mobile_developer = "mobile_developer"
    desktop_developer = "desktop_developer"
    embedded_systems_developer = "embedded_systems_developer"
    game_developer = "game_developer"
    data_engineer = "data_engineer"
    data_analyst = "data_analyst"
    data_scientist = "data_scientist"
    machine_learning_engineer = "machine_learning_engineer"
    devops_engineer = "devops_engineer"
    cloud_engineer = "cloud_engineer"
    site_reliability_engineer = "site_reliability_engineer"
    cybersecurity_analyst = "cybersecurity_analyst"
    qa_engineer = "qa_engineer"
    software_architect = "software_architect"
    ui_ux_designer = "ui_ux_designer"
    product_manager = "product_manager"
    scrum_master = "scrum_master"

    # Administração e Finanças
    administrative_assistant = "administrative_assistant"
    administrative_analyst = "administrative_analyst"
    office_manager = "office_manager"
    executive_assistant = "executive_assistant"
    financial_analyst = "financial_analyst"
    accountant = "accountant"
    controller = "controller"
    auditor = "auditor"

    # Comercial
    sales_representative = "sales_representative"
    inside_sales = "inside_sales"
    account_executive = "account_executive"
    account_manager = "account_manager"
    business_development = "business_development"
    customer_success_manager = "customer_success_manager"

    # Marketing
    marketing_analyst = "marketing_analyst"
    digital_marketing_specialist = "digital_marketing_specialist"
    social_media_manager = "social_media_manager"
    seo_specialist = "seo_specialist"
    content_writer = "content_writer"
    copywriter = "copywriter"
    graphic_designer = "graphic_designer"

    # Recursos Humanos
    recruiter = "recruiter"
    talent_acquisition_specialist = "talent_acquisition_specialist"
    hr_analyst = "hr_analyst"
    hr_business_partner = "hr_business_partner"

    # Engenharia
    civil_engineer = "civil_engineer"
    mechanical_engineer = "mechanical_engineer"
    electrical_engineer = "electrical_engineer"
    production_engineer = "production_engineer"
    chemical_engineer = "chemical_engineer"

    # Saúde
    physician = "physician"
    nurse = "nurse"
    pharmacist = "pharmacist"
    physiotherapist = "physiotherapist"
    psychologist = "psychologist"
    nutritionist = "nutritionist"
    dentist = "dentist"

    # Educação
    teacher = "teacher"
    professor = "professor"
    pedagogue = "pedagogue"
    school_coordinator = "school_coordinator"

    # Jurídico
    lawyer = "lawyer"
    legal_assistant = "legal_assistant"
    paralegal = "paralegal"

    # Logística
    logistics_analyst = "logistics_analyst"
    supply_chain_analyst = "supply_chain_analyst"
    warehouse_supervisor = "warehouse_supervisor"
    procurement_specialist = "procurement_specialist"

    # Atendimento
    customer_service_representative = "customer_service_representative"
    technical_support_specialist = "technical_support_specialist"
    help_desk_analyst = "help_desk_analyst"

    # Indústria
    production_operator = "production_operator"
    maintenance_technician = "maintenance_technician"
    industrial_mechanic = "industrial_mechanic"
    electrician = "electrician"

    # Outros
    intern = "intern"
    trainee = "trainee"
    freelancer = "freelancer"
    consultant = "consultant"

class MimeTypes(Enum):
    docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    pdf = "application/pdf"

class Sites(str, Enum):
    linkedin = "linkedin"
    indeed = "indeed"


def initialize_directories():
    """
    Inicializa os diretórios necessários para o armazenamento dos arquivos.
    """
    for type_dir in TypeFolder:
        path = DirPaths.DIR_UPLOAD.value / type_dir.value
        path.mkdir(parents=True, exist_ok=True)

__all__ = [
    "TemplateFile",
    "DirPaths",
    "MimeTypes",
    "TypeFolder",
    "Language",
    "CVCategory",
    "Sites",
    "initialize_directories"
]