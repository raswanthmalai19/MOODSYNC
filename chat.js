// DOM Elements
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const moodButtons = document.querySelectorAll('.mood-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const recommendationsContainer = document.getElementById('recommendations');

// API URL (will connect to backend)
const API_URL = 'http://localhost:5000/api/recommendations';

// For development/testing - will use this URL until backend is ready
const MOCK_API = true;

// Current active tab
let activeTab = 'videos';

// Initialize the UI
function initializeUI() {
    // Setup event listeners
    sendBtn.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // Setup mood buttons
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            sendMoodSelection(mood);
        });
    });

    // Setup tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active tab
            activeTab = button.dataset.tab;
            
            // Update UI
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // If we have recommendations, filter them based on the active tab
            if (currentRecommendations) {
                displayRecommendations(currentRecommendations);
            }
        });
    });
}

// Store the latest recommendations
let currentRecommendations = null;

// Handle user text message
function handleUserMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    userInput.value = '';
    
    // Process the message (send to backend)
    processUserMood(message);
}

// Handle mood button selection
function sendMoodSelection(mood) {
    // Add user mood selection to chat
    const moodMessage = `I'm feeling ${mood}`;
    addMessageToChat(moodMessage, 'user');
    
    // Process the mood
    processUserMood(moodMessage);
}

// Add a message to the chat box
function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;
    
    messageElement.appendChild(messageContent);
    chatBox.appendChild(messageElement);
    
    // Scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Process user mood (send to backend)
function processUserMood(moodText) {
    // Show loading state
    recommendationsContainer.innerHTML = `
        <div class="loading-placeholder">
            <p>Finding the perfect content for your mood...</p>
        </div>
    `;
    
    // Add bot acknowledgment
    addMessageToChat('I understand your mood. Let me find some content for you...', 'bot');
    
    // If using mock API for development
    if (MOCK_API) {
        setTimeout(() => {
            // Generate mock recommendations based on mood text
            const mockData = generateMockRecommendations(moodText);
            handleRecommendations(mockData);
        }, 1500); // Simulate API delay
        return;
    }
    
    // Send to backend API
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mood: moodText })
    })
    .then(response => response.json())
    .then(data => {
        handleRecommendations(data);
    })
    .catch(error => {
        console.error('Error fetching recommendations:', error);
        addMessageToChat('Sorry, I encountered an error getting recommendations. Please try again.', 'bot');
        recommendationsContainer.innerHTML = `
            <div class="loading-placeholder">
                <p>Could not load recommendations. Please try again.</p>
            </div>
        `;
    });
}

// Handle the recommendations response
function handleRecommendations(data) {
    // Store the recommendations
    currentRecommendations = data;
    
    // Add bot response
    addMessageToChat(`I found some ${data.mood_detected} content that I think you'll enjoy!`, 'bot');
    
    // Display the recommendations
    displayRecommendations(data);
}

// Display recommendations in the UI
function displayRecommendations(data) {
    // Get recommendations for the active tab
    let recommendations;
    switch (activeTab) {
        case 'videos':
            recommendations = data.youtube || [];
            break;
        case 'music':
            recommendations = data.spotify || [];
            break;
        case 'podcasts':
            recommendations = data.podcasts || [];
            break;
        default:
            recommendations = [];
    }
    
    // Display empty state if no recommendations
    if (recommendations.length === 0) {
        recommendationsContainer.innerHTML = `
            <div class="loading-placeholder">
                <p>No ${activeTab} recommendations found for this mood.</p>
            </div>
        `;
        return;
    }
    
    // Create recommendation cards
    const recommendationsHTML = recommendations.map(item => `
        <a href="${item.link}" target="_blank" class="recommendation-card">
            <div class="card-thumbnail">
                <img src="${item.thumbnail}" alt="${item.title}">
            </div>
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.description || ''}</p>
                <span class="source">${item.source}</span>
            </div>
        </a>
    `).join('');
    
    recommendationsContainer.innerHTML = recommendationsHTML;
}

// Generate mock recommendations for development
function generateMockRecommendations(moodText) {
    let moodCategory = 'neutral';
    
    // Simple mood detection for testing
    const lowerMood = moodText.toLowerCase();
    if (lowerMood.includes('happy') || lowerMood.includes('joy') || lowerMood.includes('excited')) {
        moodCategory = 'happy';
    } else if (lowerMood.includes('sad') || lowerMood.includes('depressed') || lowerMood.includes('down')) {
        moodCategory = 'sad';
    } else if (lowerMood.includes('relaxed') || lowerMood.includes('calm') || lowerMood.includes('peaceful')) {
        moodCategory = 'relaxed';
    } else if (lowerMood.includes('energetic') || lowerMood.includes('hyper') || lowerMood.includes('active')) {
        moodCategory = 'energetic';
    } else if (lowerMood.includes('focused') || lowerMood.includes('concentrat') || lowerMood.includes('productive')) {
        moodCategory = 'focused';
    }
    
    // Mock data structure that mimics what the backend will return
    return {
        mood_detected: moodCategory,
        youtube: [
            {
                title: `${moodCategory.charAt(0).toUpperCase() + moodCategory.slice(1)} Music Mix 2025`,
                description: 'The best music to match your current mood',
                thumbnail: 'https://via.placeholder.com/120x80',
                link: 'https://youtube.com',
                source: 'YouTube'
            },
            {
                title: `Top 10 ${moodCategory.charAt(0).toUpperCase() + moodCategory.slice(1)} Moments in Movies`,
                description: 'Cinematic scenes to enhance your mood',
                thumbnail: 'https://via.placeholder.com/120x80',
                link: 'https://youtube.com',
                source: 'YouTube'
            },
            {
                title: `${moodCategory.charAt(0).toUpperCase() + moodCategory.slice(1)} Vlog Compilation`,
                description: 'Experience the best moments that match your mood',
                thumbnail: 'https://via.placeholder.com/120x80',
                link: 'https://youtube.com',
                source: 'YouTube'
            }
        ],
        spotify: [
            {
                title: `${moodCategory.charAt(0).toUpperCase() + moodCategory.slice(1)} Vibes Playlist`,
                description: 'Curated tracks to match your current feeling',
                thumbnail: 'https://via.placeholder.com/120x80',
                link: 'https://spotify.com',
                source: 'Spotify'
            },
            {
                title: `${moodCategory.charAt(0).toUpperCase() + moodCategory.slice(1)} Beats`,
                description: 'Perfect rhythm for your mood',
                thumbnail: 'https://via.placeholder.com/120x80',
                link: 'https://spotify.com',
                source: 'Spotify'
            },
            {
                title: 'Mood Enhancer',
                description: `Songs to boost your ${moodCategory} feeling`,
                thumbnail: 'https://via.placeholder.com/120x80',
                link: 'https://spotify.com',
                source: 'Spotify'
            }
        ],
        podcasts: [
            
            {
                title: `${moodCategory.charAt(0).toUpperCase() + moodCategory.slice(1)} Thoughts Podcast`,
                description: 'Discussions that resonate with your current state of mind',
                thumbnail: 'https://via.placeholder.com/120x80',
                link: 'https://podcasts.com',
                source: 'Podcast'
            },
            {
                title: 'Mood Meditation',
                description: `Guided sessions for ${moodCategory} moments`,
                thumbnail: 'https://via.placeholder.com/120x80',
                link: 'https://podcasts.com',
                source: 'Podcast'
            }
        ]
    };
}

// Initialize the app
initializeUI();