# Verifynd - AI-Powered News Verification

Verifynd is a FastAPI web application designed to help users verify the authenticity and reliability of news articles. It leverages AI to analyze news content from URLs or text, provide summaries, and fetch the latest news headlines.

## Features

The application presents its core functionalities through an intuitive interface, visually highlighted by a carousel in the UI:

-   **Latest News (`latest_news.png`):** Stay informed with a constantly updated feed of the latest news articles.
-   **Summarize News (`url_summary.png`):** Quickly grasp the essence of any news article. Provide a URL, and the app delivers a concise summary.
-   **In-depth News Analysis (`fake_news_analysis.png`):**
    -   **Analyze by Text:** Paste news text directly to receive a comprehensive breakdown.
    -   **Analyze by URL:** Input a news article URL for a thorough examination.
    -   The analysis covers key aspects such as accuracy, potential bias, source credibility, and the overall tone of the content.
-   **Responsive Design:** Enjoy a seamless experience across desktops, tablets, and mobile devices.
-   **Dynamic Content Loading:** Experience smooth interactions as news and analysis results are loaded asynchronously without page reloads.

## Tech Stack

- **Backend:**
    - **Python:** Core programming language.
    - **FastAPI:** Modern, fast (high-performance) web framework for building APIs.
    - **Langchain:** Framework for developing applications powered by language models.
    - **Google Generative AI (Gemini 1.5 Flash):** Language model for analysis and summarization.
    - **Tavily AI:** Search API for gathering information.
    - **Crawl4AI:** Library for crawling websites and extracting data for AI applications.
    - **Uvicorn:** ASGI server for running FastAPI applications.
- **Frontend:**
    - **HTML5:** Standard markup language for creating web pages.
    - **CSS3:** Styling language for designing the user interface.
    - **JavaScript:** For client-side interactivity and API calls.
    - **Jinja2:** Templating engine for rendering HTML pages with dynamic data.
- **Static Files:** Served directly by FastAPI (CSS, JavaScript, Images).
- **Data Storage:**
    - `latest_news.json`: Stores the latest fetched news articles.

## Project Structure

```
Verifynd/
├── app.py                  # Main FastAPI application file
├── config.py               # Configuration (e.g., API keys)
├── latest_news.json        # Stores latest news data
├── latest_news.py          # Logic for fetching latest news
├── sumarize.py             # Logic for summarizing news
├── verify.py               # Logic for analyzing news
├── README.md               # This file
├── .env                    # Environment variables (API keys)
├── pyproject.toml          # Project metadata and dependencies for Poetry (or similar)
├── static/                 # Static assets (CSS, JS, images)
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   └── img/
├── templates/              # HTML templates (Jinja2)
│   ├── index.html
│   ├── about.html
│   └── application_details.html
├── utils/                  # Utility modules
│   ├── prompts.py          # Prompts for the LLM
│   ├── scrape.py           # Web scraping utilities
│   └── search.py           # Search utilities
└── models/                 # Pydantic models for data validation
    ├── news.py
    └── search.py
```

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd Verifynd
    ```

2.  **Create a Virtual Environment:**
    It's highly recommended to use a virtual environment to manage project dependencies.
    ```bash
    python -m venv venv
    ```
    Activate the virtual environment:
    -   Windows:
        ```bash
        .\venv\Scripts\activate
        ```
    -   macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

3.  **Install Dependencies using UV:**
    This project uses `uv` for package management, and dependencies are defined in `pyproject.toml`.
    First, ensure you have `uv` installed. If not, you can install it via pip:
    ```bash
    pip install uv
    ```
    Once `uv` is installed, you can install the project dependencies:
    ```bash
    uv pip sync
    ```
    This command will install all dependencies specified in `pyproject.toml` and `uv.lock`.

4.  **Setup Crawl4AI:**
    After installing dependencies, run the Crawl4AI setup command:
    ```bash
    uv run crawl4ai-setup
    ```

5.  **Set Up Environment Variables:**
    Create a `.env` file in the root directory of the project and add your API keys:
    ```env
    GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
    TAVILY_API_KEY="YOUR_TAVILY_API_KEY"
    ```
    Replace `"YOUR_GOOGLE_API_KEY"` and `"YOUR_TAVILY_API_KEY"` with your actual API keys. The `GOOGLE_API_KEY` is for Google's Generative AI (Gemini) and `TAVILY_API_KEY` is for the Tavily search API.

## How to Run the Application

1.  **Ensure your virtual environment is activated.**
2.  **Navigate to the project's root directory.**
3.  **Run the FastAPI application using Uvicorn:**
    ```bash
    uvicorn app:app --reload --port 5000
    ```
    -   `app:app`: Refers to the `app` instance of FastAPI in the `app.py` file.
    -   `--reload`: Enables auto-reloading the server when code changes (useful for development).
    -   `--port 5000`: Specifies the port to run the application on.

4.  **Open your web browser and go to:** `http://127.0.0.1:5000`

## API Endpoints

The application exposes the following API endpoints:

-   **`GET /`**: Serves the main home page (`index.html`).
-   **`GET /about`**: Serves the about page (`about.html`).
-   **`GET /application-details`**: Serves the application details page (`application_details.html`).
-   **`POST /refresh-news`**: Refreshes the `latest_news.json` file with new articles.
    -   **Request Body:** None
    -   **Response:** JSON object indicating success or failure and the count of news items fetched.
-   **`POST /analyze-text`**: Analyzes user-provided text.
    -   **Request Body (Form Data):** `query: str` (the text to analyze)
    -   **Response:** JSON object containing the `NewsAnalysis` data.
-   **`POST /analyze-url`**: Analyzes news content from a given URL.
    -   **Request Body (Form Data):** `url: str` (the URL of the news article)
    -   **Response:** JSON object containing the `NewsAnalysis` data.
-   **`POST /summarize-url`**: Summarizes a news article from a given URL.
    -   **Request Body (Form Data):** `url: str` (the URL of the news article)
    -   **Response:** JSON object containing the summary.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details (if applicable, otherwise state "To be added").
