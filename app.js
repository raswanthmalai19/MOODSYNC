// Initialize theme
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Theme toggle with smooth transition
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    themeToggle.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
});

// Add ripple effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    });
});

// Mood buttons animation and interaction
const moodButtons = document.querySelectorAll('.mood-btn');
const chatBox = document.getElementById('chatBox');

moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        moodButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Add active class with animation
        button.classList.add('selected');
        
        // Add user message with typing animation
        addMessage('user', button.textContent);
        
        // Simulate AI response with typing animation
        setTimeout(() => {
            addMessage('bot', getMoodResponse(button.dataset.mood));
        }, 1000);
    });
});

// Typing animation for messages
function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    
    const avatar = document.createElement('div');
    avatar.classList.add('message-avatar');
    avatar.innerHTML = `<img src="https://via.placeholder.com/40" alt="${type === 'user' ? 'User' : 'MoodSync AI'}">`;
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    chatBox.appendChild(messageDiv);
    
    // Typing animation
    let i = 0;
    const typing = setInterval(() => {
        if (i < content.length) {
            messageContent.textContent += content.charAt(i);
            i++;
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            clearInterval(typing);
        }
    }, 50);
}

// Get AI response based on mood
function getMoodResponse(mood) {
    const responses = {
        happy: "That's great! Let me find some upbeat content to match your mood! 🎉",
        sad: "I understand. Let's find some comforting content to help lift your spirits. 💝",
        relaxed: "Perfect! I'll suggest some calming content to maintain that peaceful vibe. 🌿",
        energetic: "Awesome energy! Let's find some high-energy content to match! ⚡",
        focused: "Great mindset! I'll recommend some content to help maintain your focus. 🎯",
        romantic: "Love is in the air! Let me find some romantic content for you. 💕",
        sleepy: "Time to wind down! I'll suggest some relaxing content to help you rest. 🌙"
    };
    return responses[mood] || "I understand how you're feeling. Let me find some content that matches your mood.";
}

// Animated mood chart
const moodChart = new Chart(document.getElementById('moodChart'), {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Mood Level',
            data: [8, 6, 9, 7, 8, 9, 8],
            borderColor: '#6200ee',
            backgroundColor: 'rgba(98, 0, 238, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                display: false
            },
            x: {
                display: false
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
        }
    }
});

// Parallax effect for content cards
document.querySelectorAll('.content-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation for recommendations
const recommendations = document.getElementById('recommendations');
const loadingPlaceholder = document.querySelector('.loading-placeholder');

// Simulate loading recommendations
function loadRecommendations() {
    loadingPlaceholder.style.display = 'block';
    recommendations.innerHTML = '';
    
    setTimeout(() => {
        loadingPlaceholder.style.display = 'none';
        // Add sample recommendations with animation
        for (let i = 0; i < 6; i++) {
            const card = createRecommendationCard();
            recommendations.appendChild(card);
            
            // Stagger animation
            card.style.animationDelay = `${i * 0.1}s`;
        }
    }, 2000);
}

// Create recommendation card with animation
function createRecommendationCard() {
    const card = document.createElement('div');
    card.classList.add('content-card');
    card.innerHTML = `
        <div class="content-thumbnail">
            <img src="https://via.placeholder.com/300x200" alt="Content">
            <div class="content-type">Video</div>
        </div>
        <div class="content-info">
            <h3 class="content-title">Sample Content Title ${Math.floor(Math.random() * 100)}</h3>
            <div class="content-meta">
                <div class="content-rating">
                    <i class="fas fa-star"></i>
                    <span>${(Math.random() * 2 + 3).toFixed(1)}</span>
                </div>
                <div class="content-duration">
                    <i class="fas fa-clock"></i>
                    <span>${Math.floor(Math.random() * 30 + 5)}:00</span>
                </div>
            </div>
            <div class="content-actions">
                <button class="action-btn favorite">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="action-btn share">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
    
    return card;
}

// Initialize recommendations
loadRecommendations();

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple 1s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .content-card {
        animation: fadeInUp 0.5s ease forwards;
        opacity: 0;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .message {
        animation: slideIn 0.3s ease forwards;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .mood-btn.selected {
        animation: pulse 0.5s ease;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
`;

document.head.appendChild(style);

// Add voice input functionality
const voiceInputBtn = document.getElementById('voiceInputBtn');
const userInput = document.getElementById('userInput');

if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        userInput.value = text;
    };
    
    voiceInputBtn.addEventListener('click', () => {
        voiceInputBtn.classList.add('recording');
        recognition.start();
        
        recognition.onend = () => {
            voiceInputBtn.classList.remove('recording');
        };
    });
}

// Add smooth transitions for theme changes
document.documentElement.style.setProperty('--transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');