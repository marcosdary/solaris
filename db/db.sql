create table site (
	id varchar(255) primary key,
	name varchar(255) not null unique,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp
);

create table job (
	id varchar(255) primary key,
	site_id varchar(255) not null ,
	job_url varchar(600) not null,
	title varchar(400),
	company varchar(255),
	company_url varchar(255),
	location varchar(400),
	job_level varchar(255),
	job_function varchar(255),
	description text not null,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp,
	
	constraint fk_search_job_site
		foreign key (site_id) references site(id)
		on delete restrict 
);

create table search_job (
	id varchar(255) primary key,
	is_remote bool default false,
	search varchar(800) not null,
	hours_publi int not null,
	linkedin_fetch_description bool default false,
	location varchar(255),
	pages int not null,
	country_indeed varchar(255),
	job_type varchar(255) default 'fulltime',
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp
);

create table search_job_site (
	search_job_id varchar(255) not null,
	site_id varchar(255) not null,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp,

	primary key (search_job_id, site_id),

	constraint fk_sjs_search_job
		foreign key (search_job_id)
		references search_job(id)
		on delete cascade,

	constraint fk_sjs_site
		foreign key (site_id)
		references site(id)
		on delete restrict
);


create index "idx_job_id" on job("id");

create index "idx_job_created_at" on job("created_at");

create index "idx_job_updated_at" on job("updated_at");

create index "idx_job_site" on job("site");

select * from job;
select * from site;
select * from search_job;

delete from search_job where id in (
	'ce881b43-604d-4eeb-b4ea-7e066b7c0e9e',
	'3b1edf28-771c-41e1-aa2e-2097c25773af',
	'5871359b-9258-4327-938f-d540659bd6be',
	'b842d51f-4713-46bf-872e-8bad4228f7ff',
	'260cc626-0789-47dc-b0fd-d0539fc2b1be'
)
drop table job;
drop table search_job_site; 
drop table site;
drop table search_job;




