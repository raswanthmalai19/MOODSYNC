import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel, pipeline
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json
from pathlib import Path
import logging

class AIRecommender:
    """
    Advanced AI-powered content recommendation system using transformer models
    for better mood detection and content matching.
    """
    
    def __init__(self):
        # Initialize models and tokenizers
        try:
            # Load BERT model for mood classification
            self.tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
            self.model = AutoModel.from_pretrained('bert-base-uncased')
            
            # Load sentiment analysis pipeline
            self.sentiment_analyzer = pipeline('sentiment-analysis')
            
            # Load sentence transformer for semantic similarity
            self.sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2')
            
            # Initialize emotion classifier
            self.emotion_classifier = pipeline('text-classification', 
                                            model='j-hartmann/emotion-english-distilroberta-base')
            
            logging.info("AI models loaded successfully")
            self.models_loaded = True
            
        except Exception as e:
            logging.error(f"Error loading AI models: {e}")
            self.models_loaded = False
        
        # Load mood embeddings
        self.mood_embeddings = self._initialize_mood_embeddings()
        
        # Content type embeddings for better matching
        self.content_type_embeddings = {
            'video': self._get_embedding('engaging visual content for entertainment and learning'),
            'music': self._get_embedding('audio tracks and songs for emotional expression'),
            'podcast': self._get_embedding('audio discussions and storytelling content')
        }
        
    def _initialize_mood_embeddings(self):
        """Initialize pre-computed embeddings for different moods"""
        mood_descriptions = {
            'happy': 'feeling joyful, excited, and positive about life',
            'sad': 'feeling down, melancholic, and emotionally heavy',
            'relaxed': 'feeling calm, peaceful, and at ease',
            'energetic': 'feeling dynamic, motivated, and full of energy',
            'focused': 'feeling concentrated, productive, and mentally sharp',
            'angry': 'feeling frustrated, irritated, and emotionally charged',
            'anxious': 'feeling worried, nervous, and unsettled',
            'bored': 'feeling uninterested, unstimulated, and seeking engagement',
            'nostalgic': 'feeling reminiscent of past experiences and memories',
            'romantic': 'feeling love, affection, and emotional connection'
        }
        
        return {mood: self._get_embedding(desc) for mood, desc in mood_descriptions.items()}
    
    def _get_embedding(self, text):
        """Get embedding for a piece of text using sentence transformer"""
        if not self.models_loaded:
            return np.zeros(384)  # Default embedding size for all-MiniLM-L6-v2
        return self.sentence_transformer.encode(text)
    
    def analyze_mood(self, text):
        """
        Advanced mood analysis using multiple AI models.
        Returns tuple of (mood_category, confidence_score, mood_context)
        """
        if not text or not self.models_loaded:
            return ('neutral', 0.5, {})
            
        try:
            # Get emotion classification
            emotions = self.emotion_classifier(text)
            emotion_label = emotions[0]['label']
            emotion_score = emotions[0]['score']
            
            # Get sentiment analysis
            sentiment = self.sentiment_analyzer(text)[0]
            sentiment_label = sentiment['label']
            sentiment_score = sentiment['score']
            
            # Get text embedding
            text_embedding = self._get_embedding(text)
            
            # Calculate similarity with each mood
            mood_similarities = {
                mood: cosine_similarity(
                    [text_embedding], 
                    [embedding]
                )[0][0] for mood, embedding in self.mood_embeddings.items()
            }
            
            # Get the best matching mood
            best_mood = max(mood_similarities.items(), key=lambda x: x[1])
            mood_category = best_mood[0]
            confidence = best_mood[1]
            
            # Create mood context with additional information
            mood_context = {
                'emotion': emotion_label,
                'emotion_confidence': emotion_score,
                'sentiment': sentiment_label,
                'sentiment_confidence': sentiment_score,
                'intensity': self._calculate_intensity(text),
                'temporal': self._detect_temporal_context(text),
                'keywords': self._extract_relevant_keywords(text)
            }
            
            return (mood_category, confidence, mood_context)
            
        except Exception as e:
            logging.error(f"Error in mood analysis: {e}")
            return ('neutral', 0.5, {})
    
    def get_content_recommendations(self, text, mood_category, mood_context):
        """
        Get AI-powered content recommendations based on mood and context.
        Returns dict with recommendations and their relevance scores.
        """
        if not self.models_loaded:
            return {}
            
        try:
            # Get embedding for the user's input
            query_embedding = self._get_embedding(text)
            
            # Get mood-specific embedding
            mood_embedding = self.mood_embeddings.get(mood_category, 
                                                    self._get_embedding('neutral state of mind'))
            
            # Combine embeddings for search
            combined_embedding = (query_embedding + mood_embedding) / 2
            
            # Get recommendations for each content type
            recommendations = {}
            for content_type, type_embedding in self.content_type_embeddings.items():
                # Combine with content type embedding for better matching
                search_embedding = (combined_embedding + type_embedding) / 2
                
                # Get keywords for content search
                keywords = self._generate_content_keywords(
                    text, 
                    mood_category,
                    content_type,
                    mood_context
                )
                
                recommendations[content_type] = {
                    'keywords': keywords,
                    'embedding': search_embedding.tolist(),
                    'relevance_score': float(
                        cosine_similarity([combined_embedding], [type_embedding])[0][0]
                    )
                }
            
            return recommendations
            
        except Exception as e:
            logging.error(f"Error generating recommendations: {e}")
            return {}
    
    def _calculate_intensity(self, text):
        """Calculate emotional intensity of text"""
        if not self.models_loaded:
            return 'medium'
            
        try:
            # Use sentiment score magnitude as intensity indicator
            sentiment = self.sentiment_analyzer(text)[0]
            score = abs(sentiment['score'] - 0.5) * 2  # Normalize to 0-1
            
            if score > 0.7:
                return 'high'
            elif score > 0.3:
                return 'medium'
            else:
                return 'low'
                
        except Exception:
            return 'medium'
    
    def _detect_temporal_context(self, text):
        """Detect temporal context (past, present, future) in text"""
        past_indicators = ['was', 'were', 'had', 'used to', 'remember', 'ago']
        future_indicators = ['will', 'going to', 'planning', 'future', 'soon', 'tomorrow']
        
        text_lower = text.lower()
        
        if any(indicator in text_lower for indicator in past_indicators):
            return 'past'
        elif any(indicator in text_lower for indicator in future_indicators):
            return 'future'
        else:
            return 'present'
    
    def _extract_relevant_keywords(self, text):
        """Extract relevant keywords from text using BERT"""
        if not self.models_loaded:
            return []
            
        try:
            # Tokenize and get model outputs
            inputs = self.tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
            outputs = self.model(**inputs)
            
            # Get attention weights from last layer
            attention = outputs.attentions[-1].mean(dim=1) if hasattr(outputs, 'attentions') else None
            
            if attention is not None:
                # Get tokens with highest attention scores
                token_scores = attention.mean(dim=0)[0]
                tokens = self.tokenizer.convert_ids_to_tokens(inputs['input_ids'][0])
                
                # Filter and sort tokens by attention score
                keyword_scores = [(token, score.item()) for token, score in zip(tokens, token_scores)
                                if token not in self.tokenizer.all_special_tokens]
                keyword_scores.sort(key=lambda x: x[1], reverse=True)
                
                # Return top keywords
                return [token for token, _ in keyword_scores[:5]]
            
            return []
            
        except Exception:
            return []
    
    def _generate_content_keywords(self, text, mood, content_type, mood_context):
        """Generate optimal keywords for content search based on all available context"""
        base_keywords = []
        
        # Add mood-based keywords
        base_keywords.append(mood)
        
        # Add emotion-based keywords if available
        if 'emotion' in mood_context:
            base_keywords.append(mood_context['emotion'])
        
        # Add intensity
        if 'intensity' in mood_context:
            base_keywords.append(f"{mood_context['intensity']} {mood}")
        
        # Add extracted keywords from text
        if 'keywords' in mood_context:
            base_keywords.extend(mood_context['keywords'])
        
        # Add content type specific keywords
        if content_type == 'video':
            base_keywords.extend(['videos', 'watch', 'visual'])
        elif content_type == 'music':
            base_keywords.extend(['music', 'songs', 'playlist'])
        elif content_type == 'podcast':
            base_keywords.extend(['podcast', 'talk', 'discussion'])
        
        # Remove duplicates and return
        return list(dict.fromkeys(base_keywords)) 