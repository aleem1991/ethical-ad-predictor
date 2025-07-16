# api.py - Corrected and Optimized for Server Use
import uvicorn
# 1. Start with ALL your imports
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import json
import re
from feature_engineering import count_keywords, get_sentiment, PRIVACY_KEYWORDS, URGENCY_KEYWORDS

# 2. IMMEDIATELY create the FastAPI app object. This is crucial for performance.
#    Loading the model here means it's done once at startup, not for every request.
app = FastAPI(title="Ethical Ad Predictor API", description="Predicts ad performance with an ethical lens.")

# 3. Define any Pydantic models (your input classes)
class AdInput(BaseModel):
    ad_text: str
    image_url: str = None

# 4. Load your model and any other global assets
model = joblib.load('saved_model/model.joblib')
with open('saved_model/model_columns.json', 'r') as f:
    model_columns = json.load(f)

# 5. NOW you can define your endpoints because 'app' exists
@app.post("/predict")
def predict(ad_input: AdInput):
    # --- CHANGE 1: Calculate scores ONCE and store them in variables. ---
    # This is more efficient and prevents bugs.
    creepiness_score_val = count_keywords(ad_input.ad_text, PRIVACY_KEYWORDS)
    urgency_score_val = count_keywords(ad_input.ad_text, URGENCY_KEYWORDS)

    features = {
        'text_length': len(ad_input.ad_text),
        'has_cta': 1 if re.search(r'shop now|learn more|order today|enroll', ad_input.ad_text, re.IGNORECASE) else 0,
        'creepiness_score': creepiness_score_val, # Use the variable
        'urgency_score': urgency_score_val,     # Use the variable
        'sentiment': get_sentiment(ad_input.ad_text),
        
        # --- CHANGE 2: Removed confusing mock logic for the image feature. ---
        # This now simply checks if an image URL was provided at all. It's cleaner.
        'has_image_text': 1 if ad_input.image_url else 0
    }
    
    live_df = pd.DataFrame([features], columns=model_columns)
    prediction = model.predict(live_df)[0]
    
    # We return the scores that we already calculated above. No need to calculate them again.
    return {
        "predicted_performance_score": round(float(prediction), 2),
        "ethical_risk_assessment": {
            "creepiness_score": creepiness_score_val,
            "urgency_score": urgency_score_val
        }
    }


@app.get("/")
def read_root():
    return {"status": "API is running"}