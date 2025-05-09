from tavily import TavilyClient
from config import TAVILY_API_KEY
from models.search import TavilySearchResponse
tavily_client = TavilyClient(api_key=TAVILY_API_KEY)
def tavily_search(query: str, max_results: int = 5) -> TavilySearchResponse:
    results = tavily_client.search(query, max_results=max_results)
    return results

