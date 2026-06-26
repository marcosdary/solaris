from pytest import mark

from app.repositories import SiteRepository

@mark.asyncio
async def test_novo_registro_site_no_banco_dados(faker, async_session):
    name = faker.name()
    site_repo = SiteRepository(async_session)
    registry = await site_repo.create(name=name)
    await async_session.commit()
    await async_session.refresh(registry)
    assert registry.name == name

@mark.xfail
@mark.asyncio
async def test_erro_ao_atribuir_none_ao_atributo_name(async_session):
    name = None
    site_repo = SiteRepository(async_session)
    registry = await site_repo.create(name=name)
    await async_session.commit()
    await async_session.refresh(registry)
    assert registry.name == name

@mark.asyncio
async def test_retorno_dos_registros_existentes_na_tabela_site(async_session):
    site_repo = SiteRepository(async_session)
    rows = await site_repo.select_all()
    assert rows


