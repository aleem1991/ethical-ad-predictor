# api.py
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import json
import re
# Initialize FastAPI app
app = FastAPI(title="Ethical Ad Predictor API", description="Predicts ad performance with an ethical lens.")

# Define the input data model using Pydantic
class AdInput(BaseModel):
    ad_text: str
    image_url: str = None # Optional image url

# Load the model and columns
model = joblib.load('saved_model/model.joblib')
with open('saved_model/model_columns.json', 'r') as f:
    model_columns = json.load(f)

# Import a subset of feature engineering functions
# In a real app, this file would be shared or imported from a common library
from feature_engineering import count_keywords, get_sentiment, PRIVACY_KEYWORDS, URGENCY_KEYWORDS

@app.post("/predict")
def predict(ad_input: AdInput):
    """
    Predicts ad performance and returns ethical risk scores.
    """
    # Create a DataFrame from the input
    data = {'ad_text': [ad_input.ad_text], 'image_url': [ad_input.image_url]}
    df = pd.DataFrame(data)

    # --- Feature Engineering on the fly ---
    # We re-create the features for the single input row
    creepiness = count_keywords(ad_input.ad_text, PRIVACY_KEYWORDS)
    urgency = count_keywords(ad_input.ad_text, URGENCY_KEYWORDS)
    
    features = {
        'text_length': len(ad_input.ad_text),
        'has_cta': 1 if re.search(r'shop now|learn more|order today|enroll', ad_input.ad_text, re.IGNORECASE) else 0,
        'creepiness_score': creepiness,
        'urgency_score': urgency,
        'sentiment': get_sentiment(ad_input.ad_text),
        'has_image_text': 1 if ad_input.image_url and 'img2' in ad_input.image_url else 0 # Mock image feature
    }

    # Create a DataFrame with the correct column order
    live_df = pd.DataFrame([features], columns=model_columns)

    # Make prediction
    prediction = model.predict(live_df)[0]
    
    return {
        "predicted_performance_score": round(float(prediction), 2),
        "ethical_risk_assessment": {
            "creepiness_score": creepiness,
            "urgency_score": urgency
        }
    }

# Health check endpoint
@app.get("/")
def read_root():
    return {"status": "API is running"}