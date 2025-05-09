import asyncio
from crawl4ai import AsyncWebCrawler

async def scrape_url(url):
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url=url
        )
        return result.markdown



if __name__ == "__main__":
    asyncio.run(scrape_url(url="https://www.thehindu.com/news/national/pahalgam-terror-attack-operation-sindoor-launch-live-updates-may-7-2025/article69543511.ece"))