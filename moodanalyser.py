from textblob import TextBlob
import re
import random
from collections import Counter

class MoodAnalyzer:
    """
    A comprehensive class to analyze mood from text input.
    Uses TextBlob for sentiment analysis and advanced keyword matching for specific moods.
    """
    
    def __init__(self):
        # Define mood categories and their related keywords
        self.mood_keywords = {
            'happy': ['happy', 'joy', 'excited', 'cheerful', 'great', 'wonderful', 'good', 'positive', 
                     'delighted', 'ecstatic', 'thrilled', 'overjoyed', 'pleased', 'content', 'blissful'],
            'sad': ['sad', 'depressed', 'down', 'unhappy', 'blue', 'melancholy', 'low', 'upset', 
                   'gloomy', 'heartbroken', 'disappointed', 'grief', 'sorrow', 'miserable'],
            'relaxed': ['relaxed', 'calm', 'peaceful', 'chill', 'tranquil', 'serene', 'mellow', 
                       'zen', 'soothing', 'laid-back', 'comfortable', 'easygoing', 'unwinding'],
            'energetic': ['energetic', 'active', 'hyper', 'pumped', 'motivated', 'upbeat', 'enthusiastic', 
                         'dynamic', 'lively', 'vibrant', 'invigorated', 'stimulated', 'animated'],
            'focused': ['focused', 'concentrating', 'productive', 'determined', 'studious', 'working', 
                       'attentive', 'diligent', 'mind', 'thinking', 'deep work', 'flow state'],
            'angry': ['angry', 'mad', 'frustrated', 'annoyed', 'irritated', 'furious', 
                     'enraged', 'heated', 'outraged', 'hostile', 'infuriated', 'irate'],
            'anxious': ['anxious', 'worried', 'nervous', 'stressed', 'tense', 'uneasy', 
                       'apprehensive', 'concerned', 'restless', 'panicked', 'overwhelmed'],
            'bored': ['bored', 'uninterested', 'dull', 'monotonous', 'tired of', 'tedious', 
                     'uninspired', 'unexcited', 'weary', 'apathetic', 'indifferent'],
            'nostalgic': ['nostalgic', 'reminiscing', 'memory', 'remembering', 'old times', 'past', 
                         'childhood', 'miss', 'longing', 'sentimental', 'throwback', 'good old days'],
            'romantic': ['romantic', 'love', 'loving', 'affectionate', 'passionate', 'intimate', 
                        'adoring', 'smitten', 'enamored', 'infatuated', 'dreamy']
        }
        
        # Mood intensity modifiers
        self.intensity_modifiers = {
            'very': 1.5,
            'extremely': 2.0,
            'incredibly': 2.0,
            'really': 1.5,
            'so': 1.3,
            'quite': 1.2,
            'somewhat': 0.7,
            'slightly': 0.5,
            'a bit': 0.6,
            'kind of': 0.7,
            'sort of': 0.7
        }
        
        # Initialize emoji mapping
        self._init_emoji_mapping()
        
    def _init_emoji_mapping(self):
        """Initialize emoji to mood mapping"""
        self.emoji_to_mood = {
            '😊': 'happy', '😃': 'happy', '😄': 'happy', '😁': 'happy', '😆': 'happy',
            '😍': 'happy', '🥰': 'happy', '😀': 'happy', '😇': 'happy', '🙂': 'happy',
            '☺️': 'happy', '😌': 'relaxed', '😎': 'happy', '🤩': 'happy',
            
            '😔': 'sad', '😢': 'sad', '😭': 'sad', '😞': 'sad', '😟': 'sad',
            '😥': 'sad', '😓': 'sad', '😖': 'sad', '😩': 'sad', '😪': 'sad',
            
            '😌': 'relaxed', '😴': 'relaxed', '🧘': 'relaxed', '🛌': 'relaxed',
            '🏖️': 'relaxed', '🏝️': 'relaxed', '🌅': 'relaxed', '🌄': 'relaxed',
            
            '⚡': 'energetic', '🔥': 'energetic', '💪': 'energetic', '🏃': 'energetic',
            '🚴': 'energetic', '🏋️': 'energetic', '🤸': 'energetic', '🏆': 'energetic',
            
            '🧠': 'focused', '📚': 'focused', '📝': 'focused', '💻': 'focused',
            '🔍': 'focused', '🎯': 'focused', '🤔': 'focused', '🧐': 'focused',
            
            '😡': 'angry', '😠': 'angry', '🤬': 'angry', '😤': 'angry',
            '💢': 'angry', '👿': 'angry', '💥': 'angry',
            
            '😰': 'anxious', '😨': 'anxious', '😧': 'anxious', '😦': 'anxious',
            '😱': 'anxious', '🤯': 'anxious', '😬': 'anxious',
            
            '😑': 'bored', '😒': 'bored', '🥱': 'bored', '😐': 'bored',
            '😕': 'bored', '😫': 'bored', '😤': 'bored',
            
            '🕰️': 'nostalgic', '📷': 'nostalgic', '👴': 'nostalgic', '👵': 'nostalgic',
            '📱': 'nostalgic', '🎞️': 'nostalgic', '🎭': 'nostalgic',
            
            '❤️': 'romantic', '💖': 'romantic', '💘': 'romantic', '💓': 'romantic',
            '💗': 'romantic', '💕': 'romantic', '💑': 'romantic', '👩‍❤️‍👨': 'romantic'
        }
        
    def analyze_mood(self, text):
        """
        Analyze the mood of the given text.
        Returns a tuple of (mood_category, confidence_score)
        """
        if not text:
            return ('neutral', 0.5)
        
        # Extract emojis before removing them
        emojis = self._extract_emojis(text)
        emoji_mood = self._analyze_emoji_mood(emojis)
        
        # Clean text for analysis
        clean_text = self._clean_text(text)
        
        # Try different analysis methods
        keyword_mood, keyword_score = self._keyword_match(clean_text.lower())
        sentiment_mood, sentiment_score = self._sentiment_analysis(clean_text)
        
        # Combine all signals with weights
        combined_mood = self._combine_mood_signals(
            [(keyword_mood, keyword_score, 0.6),
             (sentiment_mood, sentiment_score, 0.3),
             (emoji_mood[0], emoji_mood[1], 0.1)]
        )
        
        return combined_mood
    
    def _extract_emojis(self, text):
        """Extract emojis from text"""
        emoji_pattern = re.compile("["
                                  u"\U0001F600-\U0001F64F"  # emoticons
                                  u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                                  u"\U0001F680-\U0001F6FF"  # transport & map symbols
                                  u"\U0001F700-\U0001F77F"  # alchemical symbols
                                  u"\U0001F780-\U0001F7FF"  # Geometric Shapes
                                  u"\U0001F800-\U0001F8FF"  # Supplemental Arrows-C
                                  u"\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
                                  u"\U0001FA00-\U0001FA6F"  # Chess Symbols
                                  u"\U0001FA70-\U0001FAFF"  # Symbols and Pictographs Extended-A
                                  u"\U00002702-\U000027B0"  # Dingbats
                                  u"\U000024C2-\U0001F251" 
                                  "]+", flags=re.UNICODE)
        return emoji_pattern.findall(text)
    
    def _analyze_emoji_mood(self, emojis):
        """Analyze mood based on emojis"""
        if not emojis:
            return ('neutral', 0.5)
        
        mood_counts = Counter()
        for emoji in emojis:
            if emoji in self.emoji_to_mood:
                mood_counts[self.emoji_to_mood[emoji]] += 1
        
        if not mood_counts:
            return ('neutral', 0.5)
        
        # Find the most common mood
        most_common_mood, count = mood_counts.most_common(1)[0]
        confidence = min(1.0, count / len(emojis) + 0.2)  # Add small bonus
        
        return (most_common_mood, confidence)
    
    def _clean_text(self, text):
        """Clean text by removing emojis and extra whitespace"""
        emoji_pattern = re.compile("["
                                  u"\U0001F600-\U0001F64F"  # emoticons
                                  u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                                  u"\U0001F680-\U0001F6FF"  # transport & map symbols
                                  u"\U0001F700-\U0001F77F"  # alchemical symbols
                                  u"\U0001F780-\U0001F7FF"  # Geometric Shapes
                                  u"\U0001F800-\U0001F8FF"  # Supplemental Arrows-C
                                  u"\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
                                  u"\U0001FA00-\U0001FA6F"  # Chess Symbols
                                  u"\U0001FA70-\U0001FAFF"  # Symbols and Pictographs Extended-A
                                  u"\U00002702-\U000027B0"  # Dingbats
                                  u"\U000024C2-\U0001F251" 
                                  "]+", flags=re.UNICODE)
        clean_text = emoji_pattern.sub(r'', text)
        return ' '.join(clean_text.split())
    
    def _keyword_match(self, text):
        """
        Advanced keyword matching with context analysis.
        Considers intensity modifiers and negations.
        """
        if not text:
            return ('neutral', 0.5)
        
        words = text.lower().split()
        mood_scores = {mood: 0 for mood in self.mood_keywords.keys()}
        
        # Check for negations
        negations = ['not', 'no', "don't", "doesn't", "isn't", "aren't", "wasn't", "weren't",
                     "haven't", "hasn't", "hadn't", "won't", "wouldn't", "can't", "couldn't"]
        
        # Look for intensity modifiers
        current_modifier = 1.0
        negated = False
        
        for i, word in enumerate(words):
            # Check for negations
            if word in negations or word.endswith("n't"):
                negated = not negated
                continue
                
            # Check for intensity modifiers
            if word in self.intensity_modifiers:
                current_modifier = self.intensity_modifiers[word]
                continue
                
            # Check for two-word intensity modifiers
            if i < len(words) - 1:
                two_word = word + " " + words[i+1]
                if two_word in self.intensity_modifiers:
                    current_modifier = self.intensity_modifiers[two_word]
                    continue
            
            # Check word against mood keywords
            for mood, keywords in self.mood_keywords.items():
                if word in keywords:
                    # Apply negation and modifier
                    score = current_modifier
                    if negated:
                        # If mood is negated, reduce its score and slightly increase opposite moods
                        mood_scores[mood] -= score
                        
                        # Increase opposite moods slightly
                        if mood == 'happy':
                            mood_scores['sad'] += score * 0.5
                        elif mood == 'sad':
                            mood_scores['happy'] += score * 0.5
                        elif mood == 'relaxed':
                            mood_scores['anxious'] += score * 0.5
                        elif mood == 'anxious':
                            mood_scores['relaxed'] += score * 0.5
                    else:
                        mood_scores[mood] += score
                    
                    # Reset modifiers after applying
                    current_modifier = 1.0
                    negated = False
        
        # Find the mood with highest score
        if all(score == 0 for score in mood_scores.values()):
            return ('neutral', 0.5)
        
        best_mood = max(mood_scores.items(), key=lambda x: x[1])
        
        # Calculate confidence based on the difference with next highest mood
        sorted_moods = sorted(mood_scores.items(), key=lambda x: x[1], reverse=True)
        if len(sorted_moods) > 1 and sorted_moods[0][1] > 0:
            # Normalize confidence to 0.5-1.0 range
            confidence = 0.5 + min(0.5, sorted_moods[0][1] / 3)
            
            # Reduce confidence if there's a close second
            if sorted_moods[1][1] > 0:
                difference_ratio = sorted_moods[1][1] / sorted_moods[0][1]
                if difference_ratio > 0.7:  # If second mood is close
                    confidence *= 0.8
        else:
            confidence = 0.5
            
        return (best_mood[0], confidence) if best_mood[1] > 0 else ('neutral', 0.5)
    
    def _sentiment_analysis(self, text):
        """
        Enhanced sentiment analysis using TextBlob.
        Maps polarity and subjectivity to mood categories.
        """
        if not text:
            return ('neutral', 0.5)
            
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        
        # Use polarity and subjectivity to determine mood
        if polarity >= 0.5:
            mood = 'happy'
            confidence = min(1.0, 0.6 + (polarity * 0.4))
        elif polarity >= 0.2:
            mood = 'relaxed'
            confidence = 0.5 + (polarity * 0.5)
        elif polarity <= -0.5:
            mood = 'sad'
            confidence = min(1.0, 0.6 + (abs(polarity) * 0.4))
        elif polarity <= -0.2:
            mood = 'anxious'
            confidence = 0.5 + (abs(polarity) * 0.5)
        else:
            # For neutral polarity, use subjectivity to determine if the person is expressing something
            if subjectivity > 0.6:
                # High subjectivity with neutral sentiment often indicates mixed feelings
                mood = 'bored' if random.random() > 0.5 else 'focused'
                confidence = 0.5 + (subjectivity * 0.2)
            else:
                mood = 'neutral'
                confidence = 0.5
        
        return (mood, confidence)
    
    def _combine_mood_signals(self, mood_signals):
        """
        Combine multiple mood signals with weights.
        mood_signals is a list of (mood, confidence, weight) tuples.
        """
        if not mood_signals:
            return ('neutral', 0.5)
        
        # Calculate weighted score for each mood
        mood_scores = {}
        for mood, confidence, weight in mood_signals:
            if mood not in mood_scores:
                mood_scores[mood] = 0
            mood_scores[mood] += confidence * weight
        
        # Get the mood with highest weighted score
        if not mood_scores:
            return ('neutral', 0.5)
            
        best_mood = max(mood_scores.items(), key=lambda x: x[1])
        
        # Calculate overall confidence
        total_weight = sum(weight for _, _, weight in mood_signals)
        weighted_confidence = best_mood[1] / total_weight
        
        # Scale confidence to a reasonable range (0.5-1.0)
        scaled_confidence = 0.5 + (weighted_confidence * 0.5)
        
        return (best_mood[0], scaled_confidence)
    
    def get_keywords_for_mood(self, mood):
        """
        Get content keywords based on the detected mood.
        Returns a list of search terms that can be used with content APIs.
        """
        # Map moods to content keywords for API searches
        mood_content_mapping = {
            'happy': ['uplifting', 'cheerful', 'positive', 'upbeat', 'feel-good', 'happiness', 
                     'joyful', 'inspiring', 'motivational', 'comedy', 'fun'],
            
            'sad': ['emotional', 'melancholy', 'reflective', 'thoughtful', 'soothing', 
                   'moving', 'heartfelt', 'comforting', 'bittersweet', 'poignant'],
            
            'relaxed': ['calm', 'peaceful', 'ambient', 'meditation', 'relaxation', 'lofi', 
                       'chill', 'acoustic', 'nature sounds', 'sleep', 'zen'],
            
            'energetic': ['upbeat', 'workout', 'energizing', 'dance', 'motivation', 'pump up', 
                         'high energy', 'cardio', 'power', 'adrenaline', 'hype'],
            
            'focused': ['concentration', 'study', 'productivity', 'focus', 'background', 
                       'instrumental', 'deep work', 'brain waves', 'binaural beats', 'ambient'],
            
            'angry': ['heavy', 'intense', 'powerful', 'release', 'cathartic', 
                     'metal', 'rock', 'venting', 'aggressive', 'empowering'],
            
            'anxious': ['calming', 'stress relief', 'soothing', 'mindfulness', 
                       'anxiety relief', 'guided meditation', 'breathing', 'relaxation techniques'],
            
            'bored': ['entertaining', 'fun', 'interesting', 'engaging', 'comedy', 
                     'mind-blowing', 'surprising', 'fascinating', 'trivia', 'list videos'],
            
            'nostalgic': ['classic', 'retro', 'throwback', 'memories', 'vintage', 
                         '80s', '90s', '2000s', 'childhood', 'reunion', 'old school'],
            
            'romantic': ['love songs', 'romantic', 'intimate', 'passion', 'ballad', 
                        'date night', 'love story', 'couples', 'relationship', 'slow dance']
        }
        
        # Return the keywords for the given mood
        keywords = mood_content_mapping.get(mood, ['recommended', 'popular', 'trending'])
        
        # Randomly select 3-5 keywords to diversify results
        num_keywords = min(len(keywords), random.randint(3, 5))
        selected_keywords = random.sample(keywords, num_keywords)
        
        return selected_keywords