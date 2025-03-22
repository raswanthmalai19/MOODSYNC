# MOODSYNC:personalized content recommendations based on your mood project for Auraflix Hackathon



MoodSync is a web application built for the 2025 Hackathon under the "StreamSync" theme—Personalized Streaming, Perfectly Timed Track. It uses a chatbot and NLP to detect a user’s mood in real-time, delivering personalized content recommendations (e.g., YouTube videos) that match their emotional state. Whether you're feeling happy, sleepy, or focused, MoodSync ensures your streaming experience is emotionally resonant and perfectly timed.

📖 Project Overview
MoodSync revolutionizes content consumption by personalizing streaming based on the user’s current mood. Through an intuitive chatbot interface, users can select their mood via buttons (e.g., "Happy," "Sad") or type descriptions (e.g., "I’m feeling focused"). Our custom NLP model analyzes the input and curates mood-appropriate content, currently focusing on YouTube videos, with plans for Spotify music and podcasts. The professional UI, featuring mood history, content stats, and a seamless chat experience, ensures a best-in-class user experience.


🚀 Features
Mood Detection: Real-time mood analysis using NLP (TextBlob + custom MoodAnalyzer) based on user inputs.
Personalized Recommendations: Curates YouTube videos tailored to the user’s mood (e.g., uplifting videos for "Happy").
Chatbot Interface: Intuitive chatbot (Alex) for mood input and interaction, supporting both button clicks and natural language.
Professional UI: Responsive design with mood history, content stats (e.g., videos watched), and favorite content tracking.
Cross-Platform Potential: Currently supports YouTube, with plans to expand to Spotify and podcasts.
Real-Time Updates: Instant content recommendations, ensuring a perfectly timed streaming experience.
🎯 How It Fits "StreamSync"
MoodSync aligns with the "StreamSync" theme by delivering personalized streaming that is perfectly timed to the user’s emotional state. It uses NLP to detect moods in real-time, recommending content that matches the user’s feelings, such as calming videos for "sleepy" or motivational clips for "energetic." This ensures an emotionally intelligent streaming experience, enhancing user engagement and satisfaction.

🛠️ Technologies Used
Backend: Python, Flask (web framework), YouTube Data API (content fetching)
NLP: TextBlob (sentiment analysis), Custom MoodAnalyzer (keyword-based mood detection)
Frontend: HTML, CSS, JavaScript (responsive UI)
Other: Google API Client Library (YouTube API integration)


🏆 Hackathon Submission Details
Problem Solved
MoodSync addresses the challenge of content overload by delivering mood-based recommendations, saving users time and enhancing emotional engagement with media.

Challenges Faced
NLP Development: Building a robust NLP model within 72 hours was tough; we used a lightweight approach but it lacks nuance.
Backend-Frontend Integration: CORS issues and delays in real-time updates were resolved, but the backend lacks full user data storage.
Content Aggregation: API rate limits and data consistency issues with the YouTube Data API were challenging.
Prototype Scope: As a prototype, features like music/podcast integration and advanced NLP are planned but not implemented due to time constraints.


Future Plans
Integrate Spotify for music and podcast networks for broader content options.
Enhance NLP with transformer models for better mood detection.
Add wearable integration for automatic mood detection (e.g., using heart rate).
Implement machine learning to refine recommendations based on user history.
Explore AR/VR for immersive mood-based experiences.

🙌 Acknowledgments
Built for the 2025 Hackathon under the "StreamSync" theme.
Inspired by research on mood-based recommendations (Analysis of Mood Tags for Multimedia Content Recommendation in Social Networks | IEEE Xplore).
Thanks to the open-source community for tools like TextBlob and Flask.
