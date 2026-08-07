-- =============================================
-- 2. Schemas
-- =============================================

CREATE SCHEMA IF NOT EXISTS private;

-- =============================================
-- 3. Tabelas (schema private — acesso exclusivo do backend)
-- =============================================

CREATE TABLE private.addresses (
    id VARCHAR(255) PRIMARY KEY,
    state VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE private.phone (
    id VARCHAR(255) PRIMARY KEY,
    ddi VARCHAR(10) NOT NULL,
    number VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE private.users (
    id VARCHAR(255) PRIMARY KEY,
    google_sub VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE private.curriculums (
    id VARCHAR(255) PRIMARY KEY,

    language VARCHAR(255) NOT NULL,
    category VARCHAR(500) NOT NULL,

    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),

    email VARCHAR(255) NOT NULL,

    github VARCHAR(255),
    linkedin VARCHAR(255) NOT NULL,

    resume TEXT NOT NULL,

    user_id VARCHAR(255) REFERENCES private.users(id) ON DELETE SET NULL,
    address_id  VARCHAR(255) REFERENCES private.addresses(id),
    phone_id  VARCHAR(255) REFERENCES private.phone(id),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE private.experiences (
    id VARCHAR(255) PRIMARY KEY,

    curriculum_id VARCHAR(255) NOT NULL
        REFERENCES private.curriculums(id)
        ON DELETE CASCADE,

    role VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NULL,
    is_remote BOOLEAN DEFAULT false,

    address_id  VARCHAR(255) REFERENCES private.addresses(id),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE private.experience_activities (
    id VARCHAR(255) PRIMARY KEY,

    experience_id VARCHAR(255) NOT NULL
        REFERENCES private.experiences(id)
        ON DELETE CASCADE,

    description TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE private.educations (
    id VARCHAR(255) PRIMARY KEY,

    curriculum_id VARCHAR(255) NOT NULL
        REFERENCES private.curriculums(id)
        ON DELETE CASCADE,

    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    address_id  VARCHAR(255) REFERENCES private.addresses(id),

    start_date DATE NOT NULL,
    end_date DATE NULL,

    is_remote BOOLEAN DEFAULT false,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE private.projects (
    id VARCHAR(255) PRIMARY KEY,

    curriculum_id VARCHAR(255) NOT NULL
        REFERENCES private.curriculums(id)
        ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    github VARCHAR(255) NOT NULL,
    demo_url VARCHAR(255),

    start_date DATE NOT NULL,
    end_date DATE NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE private.project_descriptions (
    id VARCHAR(255) PRIMARY KEY,

    project_id VARCHAR(255) NOT NULL
        REFERENCES private.projects(id)
        ON DELETE CASCADE,

    description TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE private.project_technologies (
    id VARCHAR(255) PRIMARY KEY,

    project_id VARCHAR(255) NOT NULL
        REFERENCES private.projects(id)
        ON DELETE CASCADE,

    technology VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE private.certifications (
    id VARCHAR(255) PRIMARY KEY,

    curriculum_id VARCHAR(255) NOT NULL
        REFERENCES private.curriculums(id)
        ON DELETE CASCADE,

    institution VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NULL,

    address_id  VARCHAR(255) REFERENCES private.addresses(id),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE private.curriculum_files (
    id VARCHAR(255) PRIMARY KEY,

    curriculum_id VARCHAR(255) NOT NULL
        REFERENCES private.curriculums(id)
        ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    distpath VARCHAR(255) NOT NULL,
    mimetype VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    template VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================
-- 4. Views (schema public — exposto via Supabase / PostgREST)
-- =============================================

CREATE VIEW users AS
SELECT id, name, created_at
FROM private.users;

CREATE VIEW curriculum AS
SELECT
    id,
    language,
    category,
    name,
    role,
    github,
    linkedin,
    location,
    resume,
    created_at,
    updated_at
FROM private.curriculum;

CREATE VIEW experiences AS
SELECT * FROM private.experiences;

CREATE VIEW experience_activities AS
SELECT * FROM private.experience_activities;

CREATE VIEW educations AS
SELECT * FROM private.educations;

CREATE VIEW projects AS
SELECT * FROM private.projects;

CREATE VIEW project_descriptions AS
SELECT * FROM private.project_descriptions;

CREATE VIEW project_technologies AS
SELECT * FROM private.project_technologies;

CREATE VIEW certifications AS
SELECT * FROM private.certifications;

CREATE VIEW curriculum_files AS
SELECT * FROM private.curriculum_files;

-- =============================================
-- 5. Índices (schema private)
-- =============================================

CREATE INDEX idx_curriculum_user_id ON private.curriculum(user_id);

CREATE INDEX idx_experiences_curriculum_id ON private.experiences(curriculum_id);
CREATE INDEX idx_educations_curriculum_id ON private.educations(curriculum_id);
CREATE INDEX idx_projects_curriculum_id ON private.projects(curriculum_id);
CREATE INDEX idx_certifications_curriculum_id ON private.certifications(curriculum_id);
CREATE INDEX idx_curriculum_files_curriculum_id ON private.curriculum_files(curriculum_id);

CREATE INDEX idx_experience_activities_experience_id ON private.experience_activities(experience_id);
CREATE INDEX idx_project_descriptions_project_id ON private.project_descriptions(project_id);
CREATE INDEX idx_project_technologies_project_id ON private.project_technologies(project_id);

-- =============================================
-- 6. Permissões
-- =============================================

-- app_user (FastAPI): acesso total ao schema private
GRANT USAGE ON SCHEMA private TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA private TO app_user;

-- app_user também pode ler as views públicas
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_user;

-- anon / authenticated (frontend / Supabase): só leitura nas views do public
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
