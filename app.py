from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json

from langchain_google_genai import ChatGoogleGenerativeAI
from config import GOOGLE_API_KEY
from verify import analyze, analyze_with_url
from latest_news import get_latest_news
from sumarize import summarize_url

app = FastAPI()

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates
templates = Jinja2Templates(directory="templates")

# Initialize LLM 
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", api_key=GOOGLE_API_KEY)

@app.get("/", response_class=HTMLResponse, name="root")
async def get_home(request: Request):
    # Read latest news from JSON file
    try:
        with open("latest_news.json", "r") as f:
            news_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        news_data = []
    
    return templates.TemplateResponse(
        "index.html", 
        {"request": request, "news_data": news_data, "current_page": "home"}
    )

@app.get("/about", response_class=HTMLResponse, name="about") # Added name="about"
async def about(request: Request):
    return templates.TemplateResponse(
        "about.html", 
        {"request": request, "current_page": "about"}
    )

@app.get("/application-details", response_class=HTMLResponse, name="details") # Changed name to "details"
async def application_details(request: Request):
    return templates.TemplateResponse(
        "application_details.html",
        {"request": request, "current_page": "application_details"} # current_page context remains for active link logic
    )

@app.post("/refresh-news")
async def refresh_news():
    try:
        news_list = await get_latest_news(llm, max_news=5)
        with open("latest_news.json", "w") as f:
            json.dump([news.dict() for news in news_list], f, indent=4)
        return {"success": True, "message": "News refreshed successfully", "count": len(news_list)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refreshing news: {str(e)}")

@app.post("/analyze-text")
async def analyze_text(query: str = Form(...)):
    try:
        analysis = analyze(query, llm)
        return analysis.dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing text: {str(e)}")

@app.post("/analyze-url")
async def analyze_url_endpoint(url: str = Form(...)):
    try:
        analysis = await analyze_with_url(url, llm)
        return analysis.dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing URL: {str(e)}")

@app.post("/summarize-url")
async def summarize_url_endpoint(url: str = Form(...)):
    try:
        summary = await summarize_url(url, llm)
        return summary
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error summarizing URL: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=5000)