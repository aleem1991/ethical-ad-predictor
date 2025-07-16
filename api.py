# api.py - FINAL, CORRECTED VERSION
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import json
import re
from feature_engineering import count_keywords, get_sentiment, PRIVACY_KEYWORDS, URGENCY_KEYWORDS

# 1. Create the FastAPI app object immediately
app = FastAPI(title="Ethical Ad Predictor API", description="Predicts ad performance with an ethical lens.")

# 2. Define Pydantic input models
class AdInput(BaseModel):
    ad_text: str
    image_url: str = None

# 3. Load model and other assets ONCE at startup
try:
    model = joblib.load('saved_model/model.joblib')
    with open('saved_model/model_columns.json', 'r') as f:
        model_columns = json.load(f)
except FileNotFoundError:
    # This provides a helpful error message in the logs if the model files are missing
    print("FATAL ERROR: Model files not found in 'saved_model/'. Make sure 'model.joblib' and 'model_columns.json' are present.")
    model = None # Set to None so the app doesn't crash immediately but fails on requests

# 4. Define API endpoints
@app.get("/")
def read_root():
    return {"status": "API is running. Model loaded successfully." if model else "API is running, but MODEL IS MISSING."}


@app.post("/predict")
def predict(ad_input: AdInput):
    if not model:
        return {"error": "Model is not loaded. Check server logs."}

    creepiness_score_val = count_keywords(ad_input.ad_text, PRIVACY_KEYWORDS)
    urgency_score_val = count_keywords(ad_input.ad_text, URGENCY_KEYWORDS)

    features = {
        'text_length': len(ad_input.ad_text),
        'has_cta': 1 if re.search(r'shop now|learn more|order today|enroll', ad_input.ad_text, re.IGNORECASE) else 0,
        'creepiness_score': creepiness_score_val,
        'urgency_score': urgency_score_val,
        'sentiment': get_sentiment(ad_input.ad_text),
        'has_image_text': 1 if ad_input.image_url else 0
    }
    
    live_df = pd.DataFrame([features], columns=model_columns)
    prediction = model.predict(live_df)[0]
    
    return {
        "predicted_performance_score": round(float(prediction), 2),
        "ethical_risk_assessment": {
            "creepiness_score": creepiness_score_val,
            "urgency_score": urgency_score_val
        }
    }