from pytest import mark, fixture
from sqlalchemy import select

from app.repositories import SearchJobAsyncRepository
from app.schemas import InsertDBSearchJobSchema


@fixture
def search_job_schema(faker):
    return InsertDBSearchJobSchema(
        country_indeed=faker.country(),
        hours_publi=24,
        is_remote=faker.boolean(),
        location=faker.country(),
        job_type="fulltime",
        linkedin_fetch_description=True,
        pages=10,
        search="desenvolvedor && developer && junior",
        sites=[
            "0e32a784-61a6-4a91-a27e-533834300d86",
            "4dbd56d1-2afe-43df-95de-05f1e710c730",
        ]
    )
     
@mark.asyncio
async def test_se_incluir_informacoes_ao_banco_corretamente_sem_gerar_erro_de_relacionamento(async_session, search_job_schema): 
    search_job_repo = SearchJobAsyncRepository(async_session)
    await search_job_repo.create(**search_job_schema.model_dump())
    await async_session.flush()
    assert True

@mark.asyncio
async def test_inserir_novo_job_search_na_tabela(async_session, search_job_schema):
    search_job_repo = SearchJobAsyncRepository(async_session)
    await search_job_repo.create(**search_job_schema.model_dump())
    await async_session.commit()
    assert True


    










