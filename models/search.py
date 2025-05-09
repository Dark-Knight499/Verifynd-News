from pydantic import BaseModel, Field
from typing import List, Optional, Any
class SearchResult(BaseModel):
    title: str
    url: str
    content: str
    score: float
    raw_content: Optional[str] = None

class TavilySearchResponse(BaseModel):
    query: str
    follow_up_questions: Optional[Any] = None
    answer: Optional[str] = None
    images: List[Any] = Field(default_factory=list)
    results: List[SearchResult]
    response_time: float

class SearchList(BaseModel):
    searchlist: List[str] = Field(..., title="Search List", description="List of phases or topics to search")
