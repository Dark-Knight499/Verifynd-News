from pydantic import BaseModel, Field
class News(BaseModel):
    id: int = Field(..., title="ID", description="The ID of the news article")
    title: str = Field(..., title="Title", description="The title of the news article")
    content: str = Field(..., title="Content", description="The content of the news article")
    newsurl: str = Field(..., title="News URL", description="The URL of the news article")
    imageurl: str = Field(..., title="Image URL", description="The URL of the image associated with the news article")
    tags: list[str] = Field(..., title="Tags", description="Tags associated with the article")

class NewsList(BaseModel):
    newslist: list[News] = Field(..., title="News List", description="List of news articles")
class NewsAnalysis(BaseModel):
    id: int = Field(..., title="ID", description="The ID of the news article")
    title: str = Field(..., title="Title", description="The title of the news article")
    content: str = Field(..., title="Content", description="The content of the news article")
    accuracy_score: int = Field(..., title="Accuracy Score", description="Value between 1-10 indicating factual accuracy", ge=1, le=10)
    bias_level: str = Field(..., title="Bias Level", description="Level of bias in the article", enum=["Neutral", "Low Bias", "Moderate Bias", "High Bias"])
    source_credibility: int = Field(..., title="Source Credibility", description="Value between 1-10 indicating source credibility", ge=1, le=10)
    tone: str = Field(..., title="Tone", description="Tone of the article", enum=["Neutral", "Inflammatory", "Sensationalist"])
    overall_reliability: int = Field(..., title="Overall Reliability", description="Value between 1-10 indicating overall reliability", ge=1, le=10)
    recommendation: str = Field(..., title="Recommendation", description="Short recommendation about the article's credibility")
    tags: list[str] = Field(..., title="Tags", description="Tags associated with the article")

class NewsSummary(BaseModel):
    news: News = Field(..., title="News", description="The news article to be summarized")
    summary: str = Field(..., title="Summary", description="Summary of the news article")