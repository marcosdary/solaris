-- =============================================
-- 2. schemas
-- =============================================

create schema if not exists private;

-- =============================================
-- 3. tabelas (schema private — acesso exclusivo do backend)
-- =============================================

create table private.addresses (
    id varchar(255) primary key,
    state varchar(255) not null,
    city varchar(255) not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table private.phone (
    id varchar(255) primary key,
    ddi varchar(10) not null,
    number varchar(100) not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table private.users (
    id varchar(255) primary key,
    google_sub varchar(255) unique,
    name varchar(255) not null,
    email varchar(255) unique,
    password varchar(255) not null,
    is_active boolean not null default true,

    phone_id varchar(255)
        references private.phone(id)
        on delete set null,

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table private.curriculums (
    id varchar(255) primary key,

    language varchar(255) not null,
    category varchar(500) not null,

    name varchar(255) not null,
    role varchar(255),

    email varchar(255) not null,

    github varchar(255),
    linkedin varchar(255) not null,

    resume text not null,

    user_id varchar(255)
        references private.users(id)
        on delete set null,

    address_id varchar(255)
        references private.addresses(id),

    phone_id varchar(255)
        references private.phone(id),

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table private.experiences (
    id varchar(255) primary key,

    curriculum_id varchar(255) not null
        references private.curriculums(id)
        on delete cascade,

    role varchar(255) not null,
    company varchar(255) not null,

    start_date date not null,
    end_date date null,
    is_remote boolean default false,

    address_id varchar(255)
        references private.addresses(id),

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table private.experience_activities (
    id varchar(255) primary key,

    experience_id varchar(255) not null
        references private.experiences(id)
        on delete cascade,

    description text not null,

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table private.educations (
    id varchar(255) primary key,

    curriculum_id varchar(255) not null
        references private.curriculums(id)
        on delete cascade,

    institution varchar(255) not null,
    degree varchar(255) not null,

    address_id varchar(255)
        references private.addresses(id),

    start_date date not null,
    end_date date null,

    is_remote boolean default false,

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table private.projects (
    id varchar(255) primary key,

    curriculum_id varchar(255) not null
        references private.curriculums(id)
        on delete cascade,

    name varchar(255) not null,
    github varchar(255) not null,
    demo_url varchar(255),

    start_date date not null,
    end_date date null,

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table private.project_descriptions (
    id varchar(255) primary key,

    project_id varchar(255) not null
        references private.projects(id)
        on delete cascade,

    description text not null,

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table private.project_technologies (
    id varchar(255) primary key,

    project_id varchar(255) not null
        references private.projects(id)
        on delete cascade,

    technology varchar(255) not null,

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table private.certifications (
    id varchar(255) primary key,

    curriculum_id varchar(255) not null
        references private.curriculums(id)
        on delete cascade,

    institution varchar(255) not null,
    name varchar(255) not null,

    start_date date not null,
    end_date date null,

    address_id varchar(255)
        references private.addresses(id),

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table private.curriculum_files (
    id varchar(255) primary key,

    name varchar(255) not null,
    distpath varchar(255) not null,
    mimetype varchar(255) not null,
    template varchar(255),

    curriculum_id varchar(255) not null
        references private.curriculums(id)
        on delete cascade,

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

-- =============================================
-- 4. views (schema public — exposto via supabase / postgrest)
-- =============================================

create view users as
select id, name, created_at
from private.users;

create view curriculum as
select
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
from private.curriculum;

create view experiences as
select *
from private.experiences;

create view experience_activities as
select *
from private.experience_activities;

create view educations as
select *
from private.educations;

create view projects as
select *
from private.projects;

create view project_descriptions as
select *
from private.project_descriptions;

create view project_technologies as
select *
from private.project_technologies;

create view certifications as
select *
from private.certifications;

create view curriculum_files as
select *
from private.curriculum_files;

-- =============================================
-- 5. índices (schema private)
-- =============================================

create index idx_curriculum_user_id
    on private.curriculum(user_id);

create index idx_experiences_curriculum_id
    on private.experiences(curriculum_id);

create index idx_educations_curriculum_id
    on private.educations(curriculum_id);

create index idx_projects_curriculum_id
    on private.projects(curriculum_id);

create index idx_certifications_curriculum_id
    on private.certifications(curriculum_id);

create index idx_curriculum_files_curriculum_id
    on private.curriculum_files(curriculum_id);

create index idx_experience_activities_experience_id
    on private.experience_activities(experience_id);

create index idx_project_descriptions_project_id
    on private.project_descriptions(project_id);

create index idx_project_technologies_project_id
    on private.project_technologies(project_id);