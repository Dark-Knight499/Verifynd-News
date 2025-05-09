from models.news import NewsSummary, News
from utils.scrape import scrape_url
from utils.prompts import summarize_prompt
from langchain_google_genai import ChatGoogleGenerativeAI
import asyncio

def summarize(markdown_text: str, llm: ChatGoogleGenerativeAI) -> dict:
    structure_output_llm = llm.with_structured_output(NewsSummary)
    summarized_text = structure_output_llm.invoke(summarize_prompt.format(markdown_text=markdown_text))
    return summarized_text

async def summarize_url(url: str, llm: ChatGoogleGenerativeAI) -> dict:
    markdown_text = await scrape_url(url)
    summarized_text = summarize(markdown_text, llm)
    return summarized_text



