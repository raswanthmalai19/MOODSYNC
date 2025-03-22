// Import TensorFlow.js and required dependencies
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as nlp from 'compromise';

class MoodRecommender {
    constructor() {
        this.model = null;
        this.encoder = null;
        this.contentDatabase = [];
        this.moodEmbeddings = {};
        this.initialized = false;
    }

    async initialize() {
        try {
            // Load Universal Sentence Encoder
            this.encoder = await use.load();
            
            // Initialize mood embeddings
            await this.initializeMoodEmbeddings();
            
            // Load content database
            await this.loadContentDatabase();
            
            this.initialized = true;
            console.log('MoodRecommender initialized successfully');
        } catch (error) {
            console.error('Error initializing MoodRecommender:', error);
        }
    }

    async initializeMoodEmbeddings() {
        const moods = {
            happy: "I am feeling very happy and joyful",
            sad: "I am feeling sad and down",
            relaxed: "I am feeling calm and relaxed",
            energetic: "I am feeling energetic and pumped up",
            focused: "I am feeling focused and determined",
            romantic: "I am feeling romantic and loving",
            sleepy: "I am feeling tired and sleepy"
        };

        for (const [mood, text] of Object.entries(moods)) {
            const embedding = await this.getEmbedding(text);
            this.moodEmbeddings[mood] = embedding;
        }
    }

    async loadContentDatabase() {
        // Sample content database - in production, this would come from an API or database
        this.contentDatabase = [
            {
                id: 1,
                title: "Upbeat Pop Mix",
                type: "music",
                description: "High-energy pop songs to boost your mood",
                tags: ["happy", "energetic", "pop", "upbeat"],
                embedding: null
            },
            {
                id: 2,
                title: "Calming Meditation",
                type: "video",
                description: "Peaceful meditation session for relaxation",
                tags: ["relaxed", "sleepy", "meditation", "calm"],
                embedding: null
            },
            // Add more content items...
        ];

        // Generate embeddings for all content
        for (const content of this.contentDatabase) {
            content.embedding = await this.getEmbedding(
                `${content.title} ${content.description} ${content.tags.join(' ')}`
            );
        }
    }

    async getEmbedding(text) {
        const sentences = [text];
        const embeddings = await this.encoder.embed(sentences);
        return embeddings;
    }

    async analyzeMood(text) {
        if (!this.initialized) {
            throw new Error('MoodRecommender not initialized');
        }

        // Get embedding for input text
        const textEmbedding = await this.getEmbedding(text);

        // Calculate similarity with mood embeddings
        const moodSimilarities = {};
        for (const [mood, moodEmbedding] of Object.entries(this.moodEmbeddings)) {
            const similarity = tf.metrics.cosineProximity(textEmbedding, moodEmbedding).dataSync()[0];
            moodSimilarities[mood] = similarity;
        }

        // Find the most similar mood
        const dominantMood = Object.entries(moodSimilarities)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0];

        return {
            dominantMood,
            moodConfidence: moodSimilarities[dominantMood],
            allMoods: moodSimilarities
        };
    }

    async getRecommendations(mood, count = 6) {
        if (!this.initialized) {
            throw new Error('MoodRecommender not initialized');
        }

        // Get mood embedding
        const moodEmbedding = this.moodEmbeddings[mood];

        // Calculate similarities with all content
        const contentSimilarities = await Promise.all(
            this.contentDatabase.map(async (content) => {
                const similarity = tf.metrics.cosineProximity(
                    moodEmbedding,
                    content.embedding
                ).dataSync()[0];
                return { content, similarity };
            })
        );

        // Sort by similarity and get top recommendations
        const recommendations = contentSimilarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, count)
            .map(item => item.content);

        return recommendations;
    }

    async analyzeSentiment(text) {
        const doc = nlp(text);
        const sentiment = doc.sentiment();
        return sentiment;
    }

    async getPersonalizedResponse(mood, sentiment) {
        const responses = {
            happy: {
                positive: "That's fantastic! Let's keep that positive energy going! 🎉",
                negative: "I'm glad you're feeling happy despite the challenges! 🌟"
            },
            sad: {
                positive: "I understand. Let's find something comforting to help lift your spirits. 💝",
                negative: "I'm here to help you through this. Let's find some uplifting content. 🌈"
            },
            // Add more mood-specific responses...
        };

        const sentimentKey = sentiment > 0 ? 'positive' : 'negative';
        return responses[mood]?.[sentimentKey] || "I understand how you're feeling. Let me find some content that matches your mood.";
    }
}

// Create and export the recommender instance
const moodRecommender = new MoodRecommender();
export default moodRecommender; 