get_search_list_prompt = """
Given User Query: {query}

Generate a diverse list of effective search queries to find comprehensive information. Please include:
1. Direct reformulations of the original query
2. More specific queries targeting key aspects of the topic
3. Broader queries to capture general context
4. Queries with alternative terminology and synonyms

Make each query clear, concise, and optimized for search engines. Prioritize queries likely to return factual and relevant information.

Maximum number of queries: {max_queries}
"""

analyze_prompt = """

Given the following search results, please analyze and summarize the information. The analysis should include:
1. Key points and findings from the search results
2. Any discrepancies or conflicting information
3. The overall reliability and credibility of the sources
4. Recommendations for further reading or investigation
You will be given user_query
{query}
You will be give n a list of search results or markdown.
{result_list}
Take into account the query results and your own seraches to provide a comprehensive analysis.
  Search Up the latest news!
- Accuracy: How factual and supported by evidence is the article? Check for misinformation or dubious claims.
- Bias: Identify any political, cultural, or ideological bias present in the article. Rate the bias on a scale from neutral to highly biased.
- Source Credibility: Evaluate the sources used in the article. Are they trustworthy and verifiable?
- Tone: Analyze the tone of the article (e.g., neutral, inflammatory, sensationalist).
- Overall Reliability: Provide a final score assessing the overall reliability of the article.
"""

extract_news_prompt = """
You are given the markdown content of a webpage:
{markdown_text}

Extract and structure the latest news articles found in this content. For each news item, you MUST provide these exact fields:
- id: A unique integer ID for each news article (start from 1 and increment)
- title: The complete headline of the news article
- content: A brief summary or excerpt of the article content
- newsurl: The URL of the full article (extract from the markdown if available, otherwise use the main webpage URL)
- imageurl: The URL of any image associated with the article (if available, otherwise use an empty string)
- tags: A list of relevant keyword tags for the article (at least 3 tags)

Prioritize news that is:
- Recent (published within the last week if dates are available)
- Relevant to the main topic of the webpage
- From credible sources
- Contains factual information rather than opinion

Maximum number of news articles to extract: {max_news}

You MUST return at least one news item if any news content is found, ensuring all required fields are populated.
"""

summarize_prompt = """
You are a concise and informative news summarizer. Given the following markdown content from a news article:
{markdown_text}

Please create a comprehensive summary that:
1. Captures the key facts and main points of the article
2. Preserves the most important details while removing redundancy
3. Maintains the original tone and perspective of the reporting
4. Is structured in clear, readable paragraphs
5. Is suitable for someone who wants to understand the news quickly without reading the full article

Your summary should be factual, unbiased, and focused on the core information.
"""
