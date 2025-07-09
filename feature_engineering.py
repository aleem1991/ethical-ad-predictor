# feature_engineering.py
import re
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import pytesseract
import cv2
from PIL import Image
import requests
from io import BytesIO

# --- NLP Features ---

PRIVACY_KEYWORDS = {
    'your friend', 'your friends', 'we saw you', 'based on your', 
    'people like you', 'your recent activity', 'know you like', 'saw you looked at'
}

URGENCY_KEYWORDS = {
    'limited time', 'only a few left', 'offer expires', "don't miss out", 
    'today only', 'hurry', 'last chance', '24-hour', 'now or never'
}

def count_keywords(text, keywords):
    """Counts how many keywords from a set are in the text."""
    text = text.lower()
    count = 0
    for keyword in keywords:
        if keyword in text:
            count += 1
    return count

def get_sentiment(text):
    """Returns a dictionary of sentiment scores."""
    analyzer = SentimentIntensityAnalyzer()
    sentiment = analyzer.polarity_scores(text)
    return sentiment['compound'] # We'll use the compound score

def create_nlp_features(df):
    """Creates all NLP-based features for the DataFrame."""
    df['text_length'] = df['ad_text'].apply(len)
    df['has_cta'] = df['ad_text'].apply(lambda x: 1 if re.search(r'shop now|learn more|order today|enroll', x, re.IGNORECASE) else 0)
    df['creepiness_score'] = df['ad_text'].apply(lambda x: count_keywords(x, PRIVACY_KEYWORDS))
    df['urgency_score'] = df['ad_text'].apply(lambda x: count_keywords(x, URGENCY_KEYWORDS))
    df['sentiment'] = df['ad_text'].apply(get_sentiment)
    return df

# --- Image Features ---

def extract_text_from_image(image_url):
    """Uses OCR to extract text from an image URL."""
    if not image_url or not isinstance(image_url, str):
        return ""
    try:
        response = requests.get(image_url, timeout=10)
        img = Image.open(BytesIO(response.content))
        # Convert to a format pytesseract can read
        img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        text = pytesseract.image_to_string(img_cv)
        return text
    except Exception as e:
        print(f"Could not process image {image_url}: {e}")
        return ""

def create_image_features(df):
    """Creates features based on images (in a real scenario). For this demo, we'll mock it."""
    # In a real project, this line would take a long time to run.
    # df['text_in_image'] = df['image_url'].apply(extract_text_from_image)
    # df['text_in_image_len'] = df['text_in_image'].apply(len)
    
    # Mocking for speed in this example
    df['has_image_text'] = df['image_url'].apply(lambda x: 1 if 'img2' in x else 0) # Mock feature
    return df

# --- Main Feature Engineering Pipeline ---

def create_features(df):
    """Main function to run all feature engineering steps."""
    
    # 1. Create Target Variable
    # Adding a small epsilon to avoid division by zero
    df['performance_score'] = df['impressions'] / (df['spend'] + 1e-6)
    
    # 2. Create NLP features
    df = create_nlp_features(df)
    
    # 3. Create Image features
    df = create_image_features(df)
    
    # 4. Drop unnecessary columns
    df = df.drop(columns=['ad_id', 'ad_text', 'image_url', 'impressions', 'spend'])
    
    return df