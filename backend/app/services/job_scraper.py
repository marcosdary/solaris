from jobspy import scrape_jobs
from typing import List

class JobScraperService:

    def __init__(
            self, 
            sites: List[str], 
            search: str, 
            location: str = "Brazil", 
            country_indeed: str = "Brazil*",
            pages: int = 2,
            hours_publi: int = 24,
            is_remote: bool = False,
            job_type: str = "fulltime",
            linkedin_fetch_description: bool = False,
            proxies: List[str] = list()
        ):
        """
        Buscar por vagas entre plataformas de emprego.

        Args:
            sites (List[str]): Quais sites irão ser realizadas as pesquisas por emprego. Ex.: indeed, linkedin, glassdoor
            search (str): Que informações serão pesquisadas. Ex.: Developer Sofwtare
            location (str): Localização que serão pesquisadas as vagas de emprego. Ex.: Brazil
            country_indeed: Estado que deseja buscar as vagas de emprego para Indeed e Glassdoor. Ex.: Brazil*
            pages (int): Número de itens que serão retornadas na resposta. Ex.: 10
            hours_publi (int): Qual a horas serão buscadas as vagas. Ex.: 24hs antes
            is_remote (bool): Se a vaga é para ser remoto.
            job_type (str): Tipo de emprego, que foi normalizada para 'fulltime'
            linkedin_fetch_description (bool): Serão adicionadas informações da vagas do linkedin, como título e descrição.
            proxies (List[str]): _description_
        """

        self.sites = sites
        self.search = search
        self.location = location
        self.pages = pages
        self.hours_publi = hours_publi
        self.is_remote = is_remote
        self.country_indeed = country_indeed
        self.job_type = job_type
        self.linkedin_fetch_description = linkedin_fetch_description
        self.proxies = proxies

    def get_jobs(self):
        jobs = scrape_jobs(
            site_name=self.sites,
            search_term=self.search,
            location=self.location,
            country_indeed=self.country_indeed,
            results_wanted=self.pages,
            hours_old=self.hours_publi,
            linkedin_fetch_description=self.linkedin_fetch_description,
            job_type=self.job_type,
            is_remote=self.is_remote,
        )
        return jobs
    
__all__ = ["JobScraperService"]