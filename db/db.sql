CREATE TYPE language_enum AS ENUM (
    'portuguese',
    'english',
    'spanish'
);

CREATE TYPE cv_category_enum AS ENUM (
    -- Tecnologia
    'backend_developer',
    'frontend_developer',
    'fullstack_developer',
    'mobile_developer',
    'desktop_developer',
    'embedded_systems_developer',
    'game_developer',
    'data_engineer',
    'data_analyst',
    'data_scientist',
    'machine_learning_engineer',
    'devops_engineer',
    'cloud_engineer',
    'site_reliability_engineer',
    'cybersecurity_analyst',
    'qa_engineer',
    'software_architect',
    'ui_ux_designer',
    'product_manager',
    'scrum_master',

    -- Administração e Finanças
    'administrative_assistant',
    'administrative_analyst',
    'office_manager',
    'executive_assistant',
    'financial_analyst',
    'accountant',
    'controller',
    'auditor',

    -- Comercial
    'sales_representative',
    'inside_sales',
    'account_executive',
    'account_manager',
    'business_development',
    'customer_success_manager',

    -- Marketing
    'marketing_analyst',
    'digital_marketing_specialist',
    'social_media_manager',
    'seo_specialist',
    'content_writer',
    'copywriter',
    'graphic_designer',

    -- Recursos Humanos
    'recruiter',
    'talent_acquisition_specialist',
    'hr_analyst',
    'hr_business_partner',

    -- Engenharia
    'civil_engineer',
    'mechanical_engineer',
    'electrical_engineer',
    'production_engineer',
    'chemical_engineer',

    -- Saúde
    'physician',
    'nurse',
    'pharmacist',
    'physiotherapist',
    'psychologist',
    'nutritionist',
    'dentist',

    -- Educação
    'teacher',
    'professor',
    'pedagogue',
    'school_coordinator',

    -- Jurídico
    'lawyer',
    'legal_assistant',
    'paralegal',

    -- Logística
    'logistics_analyst',
    'supply_chain_analyst',
    'warehouse_supervisor',
    'procurement_specialist',

    -- Atendimento
    'customer_service_representative',
    'technical_support_specialist',
    'help_desk_analyst',

    -- Indústria
    'production_operator',
    'maintenance_technician',
    'industrial_mechanic',
    'electrician',

    -- Outros
    'intern',
    'trainee',
    'freelancer',
    'consultant'
);

CREATE TABLE curriculum (
    id VARCHAR(255) PRIMARY KEY,

    language language_enum NOT NULL DEFAULT 'portuguese',
    category cv_category_enum NOT NULL,

    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,

    github VARCHAR(255),
    linkedin VARCHAR(255) NOT NULL,

    location VARCHAR(255) NOT NULL,

    resume TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE experiences (
    id VARCHAR(255) PRIMARY KEY,

    curriculum_id VARCHAR(255) NOT NULL
        REFERENCES curriculum(id)
        ON DELETE CASCADE,

    role VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE experience_activities (
    id VARCHAR(255) PRIMARY KEY,

    experience_id VARCHAR(255) NOT NULL
        REFERENCES experiences(id)
        ON DELETE CASCADE,

    description TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE educations (
    id VARCHAR(255) PRIMARY KEY,

    curriculum_id VARCHAR(255) NOT NULL
        REFERENCES curriculum(id)
        ON DELETE CASCADE,

    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
    id VARCHAR(255) PRIMARY KEY,

    curriculum_id VARCHAR(255) NOT NULL
        REFERENCES curriculum(id)
        ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    github VARCHAR(255) NOT NULL,
    demo_url VARCHAR(255),

    start_date DATE NOT NULL,
    end_date DATE NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE project_descriptions (
    id VARCHAR(255) PRIMARY KEY,

    project_id VARCHAR(255) NOT NULL
        REFERENCES projects(id)
        ON DELETE CASCADE,

    description TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE project_technologies (
    id VARCHAR(255) PRIMARY KEY,

    project_id VARCHAR(255) NOT NULL
        REFERENCES projects(id)
        ON DELETE CASCADE,

    technology VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE certifications (
    id VARCHAR(255) PRIMARY KEY,

    curriculum_id VARCHAR(255) NOT NULL
        REFERENCES curriculum(id)
        ON DELETE CASCADE,

    institution VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);



