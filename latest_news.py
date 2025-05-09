from langchain_google_genai import ChatGoogleGenerativeAI
import asyncio
from utils.scrape import scrape_url
from models.news import NewsList
from utils.prompts import extract_news_prompt
import json

news_websites_url = ["https://www.ndtv.com", "https://www.thehindu.com", "https://bbc.com", "https://nytimes.com"]
async def extract_news(url: str, llm: ChatGoogleGenerativeAI, max_news: int = 3) -> NewsList:
    markdown_text = await scrape_url(url)
    structure_output_llm = llm.with_structured_output(NewsList)
    extracted_news = await structure_output_llm.ainvoke(extract_news_prompt.format(markdown_text=markdown_text, max_news=max_news))
    return extracted_news

async def get_latest_news(llm: ChatGoogleGenerativeAI, max_news: int = 3) -> list[NewsList]:
    all_extracted_news = []
    for website_url in news_websites_url:
        try:
            news_list = await extract_news(website_url, llm, max_news)
            if news_list and news_list.newslist:
                all_extracted_news.extend(news_list.newslist)
                print(f"Successfully extracted {len(news_list.newslist)} news items from {website_url}")
            else:
                print(f"No news extracted from {website_url}")
        except Exception as e:
            print(f"Error extracting news from {website_url}: {str(e)}")    
    return all_extracted_news


