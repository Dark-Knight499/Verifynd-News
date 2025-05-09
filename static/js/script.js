document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to current button and tab
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Analysis option switching
    const optionButtons = document.querySelectorAll('.option-btn');
    const optionContents = document.querySelectorAll('.option-content');

    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const optionId = button.dataset.option;
            
            // Remove active class from all buttons and contents
            optionButtons.forEach(btn => btn.classList.remove('active'));
            optionContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            button.classList.add('active');
            document.getElementById(`${optionId}-option`).classList.add('active');
        });
    });

    // Handle refresh news button
    const refreshButton = document.getElementById('refresh-news');
    const newsContainer = document.getElementById('news-items');
    const newsLoading = document.getElementById('news-loading');
    const newsEmpty = document.getElementById('news-empty');

    refreshButton.addEventListener('click', async () => {
        try {
            // Show loading state
            refreshButton.disabled = true;
            newsContainer.style.display = 'none';
            newsLoading.style.display = 'flex';
            newsEmpty.style.display = 'none';

            // Make API call
            const response = await fetch('/refresh-news', {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to refresh news');
            }

            const result = await response.json();
            
            // Reload the page to show new news
            window.location.reload();
        } catch (error) {
            console.error('Error refreshing news:', error);
            alert('Error refreshing news: ' + error.message);
        } finally {
            // Hide loading state
            refreshButton.disabled = false;
            newsLoading.style.display = 'none';
            newsContainer.style.display = 'grid';
        }
    });

    // Handle analyze text form
    const analyzeTextForm = document.getElementById('analyze-text-form');
    const analyzeUrlForm = document.getElementById('analyze-url-form');
    const analysisResult = document.getElementById('analysis-result');
    const analysisContent = document.getElementById('analysis-content');
    const analysisLoading = document.getElementById('analysis-loading');
    const analyzeTextInput = document.getElementById('analyze-text');
    const analyzeUrlInput = document.getElementById('analyze-url');
    const clearAnalyzeTextFormButton = document.getElementById('clear-analyze-text-form');
    const clearAnalyzeUrlFormButton = document.getElementById('clear-analyze-url-form');
    const copyAnalysisButton = document.getElementById('copy-analysis-button');
    const analysisErrorMessage = document.getElementById('analysis-error-message');

    analyzeTextForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(analyzeTextForm);
        const query = formData.get('query');
        
        if (!query || query.trim().length < 10) {
            displayAnalysisError('Please enter at least 10 characters of text to analyze.');
            return;
        }
        
        try {
            // Show loading state
            analyzeTextForm.querySelector('button[type="submit"]').disabled = true;
            clearAnalyzeTextFormButton.style.display = 'none';
            analysisResult.style.display = 'none';
            analysisLoading.style.display = 'flex';
            analysisErrorMessage.style.display = 'none';
            copyAnalysisButton.style.display = 'none';

            // Make API call
            const response = await fetch('/analyze-text', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Failed to analyze text. Please try again.' }));
                throw new Error(errorData.detail || 'Failed to analyze text');
            }

            const result = await response.json();
            
            // Display results
            displayAnalysisResults(result);
            clearAnalyzeTextFormButton.style.display = 'inline-flex'; // Show clear button
            copyAnalysisButton.style.display = 'inline-flex'; // Show copy button
        } catch (error) {
            console.error('Error analyzing text:', error);
            displayAnalysisError(error.message);
        } finally {
            // Hide loading state
            analyzeTextForm.querySelector('button[type="submit"]').disabled = false;
            analysisLoading.style.display = 'none';
        }
    });

    analyzeUrlForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(analyzeUrlForm);
        const url = formData.get('url');
        
        if (!url || !isValidHttpUrl(url)) {
            displayAnalysisError('Please enter a valid URL (starting with http:// or https://).');
            return;
        }
        
        try {
            // Show loading state
            analyzeUrlForm.querySelector('button[type="submit"]').disabled = true;
            clearAnalyzeUrlFormButton.style.display = 'none';
            analysisResult.style.display = 'none';
            analysisLoading.style.display = 'flex';
            analysisErrorMessage.style.display = 'none';
            copyAnalysisButton.style.display = 'none';

            // Make API call
            const response = await fetch('/analyze-url', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Failed to analyze URL. Please check the URL and try again.' }));
                throw new Error(errorData.detail || 'Failed to analyze URL');
            }

            const result = await response.json();
            
            // Display results
            displayAnalysisResults(result);
            clearAnalyzeUrlFormButton.style.display = 'inline-flex'; // Show clear button
            copyAnalysisButton.style.display = 'inline-flex'; // Show copy button
        } catch (error) {
            console.error('Error analyzing URL:', error);
            displayAnalysisError(error.message);
        } finally {
            // Hide loading state
            analyzeUrlForm.querySelector('button[type="submit"]').disabled = false;
            analysisLoading.style.display = 'none';
        }
    });

    clearAnalyzeTextFormButton?.addEventListener('click', () => {
        analyzeTextInput.value = '';
        analysisResult.style.display = 'none';
        analysisErrorMessage.style.display = 'none';
        clearAnalyzeTextFormButton.style.display = 'none';
        copyAnalysisButton.style.display = 'none';
        analyzeTextInput.focus();
    });

    clearAnalyzeUrlFormButton?.addEventListener('click', () => {
        analyzeUrlInput.value = '';
        analysisResult.style.display = 'none';
        analysisErrorMessage.style.display = 'none';
        clearAnalyzeUrlFormButton.style.display = 'none';
        copyAnalysisButton.style.display = 'none';
        analyzeUrlInput.focus();
    });

    copyAnalysisButton?.addEventListener('click', () => {
        // Create a formatted text version of the analysis results
        const title = analysisContent.querySelector('.analysis-header h3')?.textContent || '';
        const scores = Array.from(analysisContent.querySelectorAll('.metric')).map(metric => {
            const name = metric.querySelector('.metric-name')?.textContent || '';
            const value = metric.querySelector('.metric-value')?.textContent || '';
            const scale = metric.querySelector('.metric-scale')?.textContent || '';
            return `${name}: ${value} ${scale}`.trim();
        }).join('\n');
        const recommendation = analysisContent.querySelector('.recommendation p')?.textContent || '';
        const tags = Array.from(analysisContent.querySelectorAll('.tag')).map(tag => tag.textContent).join(', ');
        
        const analysisText = `${title}\n\n${scores}\n\nRecommendation:\n${recommendation}\n\nTags: ${tags}`;
        
        navigator.clipboard.writeText(analysisText)
            .then(() => {
                copyAnalysisButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyAnalysisButton.innerHTML = '<i class="fas fa-copy"></i> Copy Results';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy analysis:', err);
                alert('Failed to copy analysis. Please try again.');
            });
    });

    function displayAnalysisError(message) {
        analysisErrorMessage.textContent = message;
        analysisErrorMessage.style.display = 'block';
        analysisResult.style.display = 'none';
    }

    // Handle summarize form
    const summarizeForm = document.getElementById('summarize-form');
    const summaryResult = document.getElementById('summary-result');
    const summaryContent = document.getElementById('summary-content');
    const summaryLoading = document.getElementById('summary-loading');
    const summarizeUrlInput = document.getElementById('summarize-url');
    const clearSummaryFormButton = document.getElementById('clear-summary-form');
    const copySummaryButton = document.getElementById('copy-summary-button');
    const summaryErrorMessage = document.getElementById('summary-error-message');

    summarizeForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(summarizeForm);
        const url = formData.get('url');

        if (!url || !isValidHttpUrl(url)) {
            displaySummaryError('Please enter a valid URL (starting with http:// or https://).');
            return;
        }
        
        try {
            // Show loading state
            summarizeForm.querySelector('button[type="submit"]').disabled = true;
            clearSummaryFormButton.style.display = 'none';
            summaryResult.style.display = 'none';
            summaryLoading.style.display = 'flex';
            summaryErrorMessage.style.display = 'none';

            // Make API call
            const response = await fetch('/summarize-url', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Failed to summarize URL. Please check the URL and try again.' }));
                throw new Error(errorData.detail || 'Failed to summarize URL');
            }

            const result = await response.json();
            
            // Display results
            displaySummaryResults(result);
            clearSummaryFormButton.style.display = 'inline-flex'; // Show clear button
            copySummaryButton.style.display = 'inline-flex'; // Show copy button
        } catch (error) {
            console.error('Error summarizing URL:', error);
            displaySummaryError(error.message);
        } finally {
            // Hide loading state
            summarizeForm.querySelector('button[type="submit"]').disabled = false;
            summaryLoading.style.display = 'none';
        }
    });

    clearSummaryFormButton?.addEventListener('click', () => {
        summarizeUrlInput.value = '';
        summaryResult.style.display = 'none';
        summaryErrorMessage.style.display = 'none';
        clearSummaryFormButton.style.display = 'none';
        copySummaryButton.style.display = 'none';
        summarizeUrlInput.focus();
    });

    copySummaryButton?.addEventListener('click', () => {
        const summaryText = summaryContent.querySelector('.summary-content')?.innerText;
        if (summaryText) {
            navigator.clipboard.writeText(summaryText)
                .then(() => {
                    copySummaryButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copySummaryButton.innerHTML = '<i class="fas fa-copy"></i> Copy Summary';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy summary:', err);
                    alert('Failed to copy summary. Please try again.');
                });
        }
    });

    function displaySummaryError(message) {
        summaryErrorMessage.textContent = message;
        summaryErrorMessage.style.display = 'block';
        summaryResult.style.display = 'none';
    }

    function isValidHttpUrl(string) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;  
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    // Handle "Analyze" buttons on news cards
    const analyzeNewsButtons = document.querySelectorAll('.analyze-news');
    
    analyzeNewsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const newsUrl = button.dataset.url;
            
            // Switch to analyze tab
            document.querySelector('.tab-btn[data-tab="analyze"]').click();
            
            // Switch to URL option
            document.querySelector('.option-btn[data-option="url"]').click();
            
            // Fill in the URL field
            document.getElementById('analyze-url').value = newsUrl;
        });
    });

    // Function to display analysis results
    function displayAnalysisResults(data) {
        if (!data) {
            displayAnalysisError("Received an invalid response from the server. Cannot display analysis.");
            return;
        }
        
        // Determine color classes based on scores
        const accuracyClass = getScoreClass(data.accuracy_score);
        const sourceClass = getScoreClass(data.source_credibility);
        const reliabilityClass = getScoreClass(data.overall_reliability);
        const biasClass = getBiasClass(data.bias_level);
        
        // Calculate indicator widths based on scores (assuming scores are on a 0-10 scale)
        const accuracyWidth = (data.accuracy_score / 10) * 100;
        const sourceWidth = (data.source_credibility / 10) * 100;
        const reliabilityWidth = (data.overall_reliability / 10) * 100;
        
        // Create a source icon if URL is available
        let sourceInfo = '';
        if (data.source_url) {
            sourceInfo = `
                <div class="article-source">
                    <div class="source-icon"><i class="fas fa-link"></i></div>
                    <div class="source-name">${data.source_name || 'Source'}</div>
                    <a href="${data.source_url}" target="_blank" class="source-url">View original</a>
                </div>
            `;
        }
        
        analysisContent.innerHTML = `
            <div class="analysis-header">
                ${sourceInfo}
                <h3>${data.title}</h3>
                <p>${data.content}</p>
            </div>
            
            <div class="analysis-metrics">
                <div class="metric">
                    <div class="metric-name">Accuracy</div>
                    <div class="metric-value ${accuracyClass}">${data.accuracy_score}</div>
                    <div class="metric-indicator">
                        <div class="metric-indicator-fill" style="width: ${accuracyWidth}%; background-color: ${getColorForClass(accuracyClass)};"></div>
                    </div>
                    <div class="metric-scale">out of 10</div>
                </div>
                
                <div class="metric">
                    <div class="metric-name">Bias Level</div>
                    <div class="metric-value ${biasClass}">${data.bias_level}</div>
                </div>
                
                <div class="metric">
                    <div class="metric-name">Source Credibility</div>
                    <div class="metric-value ${sourceClass}">${data.source_credibility}</div>
                    <div class="metric-indicator">
                        <div class="metric-indicator-fill" style="width: ${sourceWidth}%; background-color: ${getColorForClass(sourceClass)};"></div>
                    </div>
                    <div class="metric-scale">out of 10</div>
                </div>
                
                <div class="metric">
                    <div class="metric-name">Tone</div>
                    <div class="metric-value neutral">${data.tone}</div>
                </div>
                
                <div class="metric">
                    <div class="metric-name">Overall Reliability</div>
                    <div class="metric-value ${reliabilityClass}">${data.overall_reliability}</div>
                    <div class="metric-indicator">
                        <div class="metric-indicator-fill" style="width: ${reliabilityWidth}%; background-color: ${getColorForClass(reliabilityClass)};"></div>
                    </div>
                    <div class="metric-scale">out of 10</div>
                </div>
            </div>
            
            <div class="recommendation">
                <h4>Recommendation:</h4>
                <p>${data.recommendation}</p>
            </div>
            
            <div class="tags">
                <h4>Tags:</h4>
                <div class="news-tags">
                    ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        analysisResult.style.display = 'block';
        analysisErrorMessage.style.display = 'none';
    }
    
    // Helper function to determine color class based on score
    function getScoreClass(score) {
        if (score >= 8) return 'excellent';
        if (score >= 6) return 'good';
        if (score >= 4) return 'fair';
        return 'poor';
    }
    
    // Helper function to determine color class for bias level
    function getBiasClass(biasLevel) {
        // For bias, we consider neutral (or balanced) as "excellent"
        if (biasLevel.toLowerCase().includes('neutral') || 
            biasLevel.toLowerCase().includes('balanced')) {
            return 'excellent';
        }
        if (biasLevel.toLowerCase().includes('slight') ||
            biasLevel.toLowerCase().includes('minimal')) {
            return 'good';
        }
        if (biasLevel.toLowerCase().includes('moderate')) {
            return 'fair';
        }
        return 'poor'; // For "high" or "extreme" bias
    }
    
    // Helper function to get color for indicator fill based on class
    function getColorForClass(className) {
        switch(className) {
            case 'excellent': return '#0A8043'; // Deep green
            case 'good': return '#34A853'; // Medium green
            case 'fair': return '#FBBC05'; // Yellow
            case 'poor': return '#EA4335'; // Red
            default: return '#0058A3'; // Primary blue (for neutral)
        }
    }

    // Function to display summary results
    function displaySummaryResults(data) {
        if (!data || !data.news || !data.summary) { // Basic check for expected data structure
            displaySummaryError("Received an invalid response from the server. Cannot display summary.");
            return;
        }
        summaryContent.innerHTML = `
            <div class="news-card" style="margin-bottom: var(--space-lg);">
                <div class="news-img summary-img-container">
                    <div class="image-placeholder"></div>
                    <img src="${data.news.imageurl}" alt="${data.news.title}" onerror="this.src='/static/img/placeholder.jpg'" onload="this.parentElement.classList.add('loaded')">
                </div>
                <div class="news-content">
                    <h3>${data.news.title}</h3>
                    <div class="news-tags">
                        ${data.news.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="${data.news.newsurl}" target="_blank" class="btn secondary">Original Article</a>
                </div>
            </div>
            
            <div class="summary-section">
                <h4 class="summary-title">Summary:</h4>
                <p class="summary-content">${data.summary}</p>
            </div>
        `;
        
        summaryResult.style.display = 'block';
        summaryErrorMessage.style.display = 'none'; // Hide error message on success
    }
});