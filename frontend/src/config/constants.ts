export const CVCategory = {
  BACKEND_DEVELOPER: "backend_developer",
  FRONTEND_DEVELOPER: "frontend_developer",
  FULLSTACK_DEVELOPER: "fullstack_developer",
  MOBILE_DEVELOPER: "mobile_developer",
  DESKTOP_DEVELOPER: "desktop_developer",
  EMBEDDED_SYSTEMS_DEVELOPER: "embedded_systems_developer",
  GAME_DEVELOPER: "game_developer",
  DATA_ENGINEER: "data_engineer",
  DATA_ANALYST: "data_analyst",
  DATA_SCIENTIST: "data_scientist",
  MACHINE_LEARNING_ENGINEER: "machine_learning_engineer",
  DEVOPS_ENGINEER: "devops_engineer",
  CLOUD_ENGINEER: "cloud_engineer",
  SITE_RELIABILITY_ENGINEER: "site_reliability_engineer",
  CYBERSECURITY_ANALYST: "cybersecurity_analyst",
  QA_ENGINEER: "qa_engineer",
  SOFTWARE_ARCHITECT: "software_architect",
  UI_UX_DESIGNER: "ui_ux_designer",
  PRODUCT_MANAGER: "product_manager",
  SCRUM_MASTER: "scrum_master",

  ADMINISTRATIVE_ASSISTANT: "administrative_assistant",
  ADMINISTRATIVE_ANALYST: "administrative_analyst",
  OFFICE_MANAGER: "office_manager",
  EXECUTIVE_ASSISTANT: "executive_assistant",
  FINANCIAL_ANALYST: "financial_analyst",
  ACCOUNTANT: "accountant",
  CONTROLLER: "controller",
  AUDITOR: "auditor",

  SALES_REPRESENTATIVE: "sales_representative",
  INSIDE_SALES: "inside_sales",
  ACCOUNT_EXECUTIVE: "account_executive",
  ACCOUNT_MANAGER: "account_manager",
  BUSINESS_DEVELOPMENT: "business_development",
  CUSTOMER_SUCCESS_MANAGER: "customer_success_manager",

  MARKETING_ANALYST: "marketing_analyst",
  DIGITAL_MARKETING_SPECIALIST: "digital_marketing_specialist",
  SOCIAL_MEDIA_MANAGER: "social_media_manager",
  SEO_SPECIALIST: "seo_specialist",
  CONTENT_WRITER: "content_writer",
  COPYWRITER: "copywriter",
  GRAPHIC_DESIGNER: "graphic_designer",

  RECRUITER: "recruiter",
  TALENT_ACQUISITION_SPECIALIST: "talent_acquisition_specialist",
  HR_ANALYST: "hr_analyst",
  HR_BUSINESS_PARTNER: "hr_business_partner",

  CIVIL_ENGINEER: "civil_engineer",
  MECHANICAL_ENGINEER: "mechanical_engineer",
  ELECTRICAL_ENGINEER: "electrical_engineer",
  PRODUCTION_ENGINEER: "production_engineer",
  CHEMICAL_ENGINEER: "chemical_engineer",

  PHYSICIAN: "physician",
  NURSE: "nurse",
  PHARMACIST: "pharmacist",
  PHYSIOTHERAPIST: "physiotherapist",
  PSYCHOLOGIST: "psychologist",
  NUTRITIONIST: "nutritionist",
  DENTIST: "dentist",

  TEACHER: "teacher",
  PROFESSOR: "professor",
  PEDAGOGUE: "pedagogue",
  SCHOOL_COORDINATOR: "school_coordinator",

  LAWYER: "lawyer",
  LEGAL_ASSISTANT: "legal_assistant",
  PARALEGAL: "paralegal",

  LOGISTICS_ANALYST: "logistics_analyst",
  SUPPLY_CHAIN_ANALYST: "supply_chain_analyst",
  WAREHOUSE_SUPERVISOR: "warehouse_supervisor",
  PROCUREMENT_SPECIALIST: "procurement_specialist",

  CUSTOMER_SERVICE_REPRESENTATIVE: "customer_service_representative",
  TECHNICAL_SUPPORT_SPECIALIST: "technical_support_specialist",
  HELP_DESK_ANALYST: "help_desk_analyst",

  PRODUCTION_OPERATOR: "production_operator",
  MAINTENANCE_TECHNICIAN: "maintenance_technician",
  INDUSTRIAL_MECHANIC: "industrial_mechanic",
  ELECTRICIAN: "electrician",

  INTERN: "intern",
  TRAINEE: "trainee",
  FREELANCER: "freelancer",
  CONSULTANT: "consultant",
} as const;

export type CVCategory = (typeof CVCategory)[keyof typeof CVCategory];

export const Language = {
  ENGLISH: "english",
  PORTUGUESE: "portuguese",
  SPANISH: "spanish",
} as const;

export type Language = (typeof Language)[keyof typeof Language];