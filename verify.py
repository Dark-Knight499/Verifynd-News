from utils.search import tavily_search
from langchain_google_genai import ChatGoogleGenerativeAI
from models.news import NewsAnalysis
from utils.prompts import analyze_prompt, get_search_list_prompt
from models.search import SearchList
from utils.scrape import scrape_url
def get_result_list(query: str,llm:ChatGoogleGenerativeAI,max_query=3) :
    structure_output_llm = llm.with_structured_output(SearchList)
    search_list = structure_output_llm.invoke(get_search_list_prompt.format(query=query, max_queries=3))
    result_list = []
    for i in search_list.searchlist:
        result = tavily_search(i, max_results=3)
        result_list.append({i: result})
    return result_list

def analyze(query: str, llm: ChatGoogleGenerativeAI) -> NewsAnalysis:
    result_list = get_result_list(query,llm)
    structure_output_llm = llm.with_structured_output(NewsAnalysis)
    analysis = structure_output_llm.invoke(analyze_prompt.format(query=query, result_list=result_list))
    return analysis

async def analyze_with_url(url: str, llm: ChatGoogleGenerativeAI) -> NewsAnalysis:
    result_list = await scrape_url(url)
    analysis = analyze(result_list, llm)
    return analysis

