# api.py
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import json
import re
from feature_engineering import create_features
from fastapi.middleware.cors import CORSMiddleware

# Ethical heuristic keywords
PRIVACY_KEYWORDS = {
    'your friend', 'your friends', 'we saw you', 'based on your', 
    'people like you', 'your recent activity', 'know you like', 'saw you looked at'
}

URGENCY_KEYWORDS = {
    'limited time', 'only a few left', 'offer expires', "don't miss out", 
    'today only', 'hurry', 'last chance', '24-hour', 'now or never'
}

MEDICAL_KEYWORDS = {
    'guaranteed cure', 'miracle', '100% safe', 'doctors hate this', 
    'magic pill', 'instant weight loss', 'cure your', 'secret remedy'
}

FINANCIAL_KEYWORDS = {
    'get rich quick', 'guaranteed return', 'no risk', 'earn fast',
    'make millions', 'double your money', 'secret wealth', 'financial freedom guaranteed'
}

def count_keywords(text, keywords):
    text = text.lower()
    return sum(1 for keyword in keywords if keyword in text)

import os
from groq import Groq

def get_ethical_rewrite(ad_text, creepiness, urgency, medical, financial):
    if creepiness == 0 and urgency == 0 and medical == 0 and financial == 0:
        return None
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return "⚠️ Set GROQ_API_KEY in your environment to see AI suggested rewrites."
        
    try:
        client = Groq(api_key=api_key)
        prompt = f"Rewrite the following ad copy to sound professional, ethical, and compliant. Remove any creepy tracking language, aggressive urgency/scarcity tactics, unverified medical claims, or 'get rich quick' financial promises. Return ONLY the rewritten ad text without any conversational filler or quotation marks. Ad to rewrite: '{ad_text}'"
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        return f"⚠️ Error generating rewrite: {str(e)}"

def get_counterfactual_advice(ad_text, shap_breakdown):
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return "⚠️ Set GROQ_API_KEY in your environment to see counterfactual advice."
        
    try:
        client = Groq(api_key=api_key)
        prompt = f"You are an expert digital marketing strategist. An ad copy '{ad_text}' was evaluated by an ML model and received the following SHAP impact scores for its features: {shap_breakdown}. Provide a single, concise sentence of actionable advice on how to rewrite or adjust the ad strategy to improve the score, specifically targeting the features with negative scores (if any). Do not use introductory filler, just give the advice directly."
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        return f"⚠️ Error generating advice: {str(e)}"

app = FastAPI(title="Ethical Ad Predictor API", description="Hybrid Multi-Modal Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AdInput(BaseModel):
    ad_text: str
    image_url: str = None
    target_age: int = 35
    area_income: float = 60000.0
    target_gender: str = "All"
    hour: int = 9
    day_of_week: int = 0

try:
    model = joblib.load('saved_model/model.joblib')
    with open('saved_model/model_columns.json', 'r') as f:
        model_columns = json.load(f)
        
    # Initialize SHAP explainer
    import shap
    explainer = shap.TreeExplainer(model)
except FileNotFoundError:
    print("FATAL ERROR: Model files not found in 'saved_model/'.")
    model = None
    explainer = None

@app.get("/")
def read_root():
    return {"status": "API is running. Model loaded successfully." if model else "API is running, but MODEL IS MISSING."}

@app.post("/predict")
def predict(ad_input: AdInput):
    if not model:
        return {"error": "Model is not loaded. Check server logs."}

    # 1. Ethical & Compliance Heuristics
    creepiness_score_val = count_keywords(ad_input.ad_text, PRIVACY_KEYWORDS)
    urgency_score_val = count_keywords(ad_input.ad_text, URGENCY_KEYWORDS)
    medical_score_val = count_keywords(ad_input.ad_text, MEDICAL_KEYWORDS)
    financial_score_val = count_keywords(ad_input.ad_text, FINANCIAL_KEYWORDS)

    # 2. Map frontend inputs to model features
    is_male = 1 if ad_input.target_gender == "Male" else 0
    
    input_data = {
        'Ad Topic Line': ad_input.ad_text,
        'Age': ad_input.target_age,
        'Area Income': ad_input.area_income,
        'Male': is_male,
        'Hour': ad_input.hour,
        'DayOfWeek': ad_input.day_of_week
    }
    
    df = pd.DataFrame([input_data])
    
    # 3. Generate NLP Embeddings and tabular features
    features_df = create_features(df, is_training=False)
    
    # 4. Predict
    live_df = features_df[model_columns]
    
    # predict_proba returns array like [[prob_class_0, prob_class_1]]
    prob_click = model.predict_proba(live_df)[0][1]
    
    # 5. Audience Insights Batch Prediction
    base_row = live_df.iloc[[0]].copy()
    
    ages_to_test = [21, 30, 40, 50, 60]
    age_labels = ["18-24", "25-34", "35-44", "45-54", "55+"]
    age_df = pd.concat([base_row]*len(ages_to_test), ignore_index=True)
    age_df['Age'] = ages_to_test
    age_scores = model.predict_proba(age_df)[:, 1]
    
    incomes_to_test = [30000, 50000, 70000, 90000]
    income_labels = ["<$40k", "$40k-$60k", "$60k-$80k", ">$80k"]
    inc_df = pd.concat([base_row]*len(incomes_to_test), ignore_index=True)
    inc_df['Area Income'] = incomes_to_test
    inc_scores = model.predict_proba(inc_df)[:, 1]
    
    audience_insights = {
        "age_performance": [{"label": lbl, "score": round(float(score) * 100, 2)} for lbl, score in zip(age_labels, age_scores)],
        "income_performance": [{"label": lbl, "score": round(float(score) * 100, 2)} for lbl, score in zip(income_labels, inc_scores)]
    }
    
    # 6. Explain with SHAP
    shap_values = explainer.shap_values(live_df)
    
    sv = shap_values[0] if isinstance(shap_values, list) else shap_values[0]
    
    shap_breakdown = {
        "Ad Copy Text": 0.0,
        "Target Age": 0.0,
        "Area Income": 0.0,
        "Target Gender": 0.0,
        "Schedule (Time & Day)": 0.0
    }
    
    for i, col in enumerate(model_columns):
        val = sv[i]
        if col.startswith('emb_'):
            shap_breakdown["Ad Copy Text"] += val
        elif col == 'Age':
            shap_breakdown["Target Age"] += val
        elif col == 'Area Income':
            shap_breakdown["Area Income"] += val
        elif col == 'Male':
            shap_breakdown["Target Gender"] += val
        elif col in ['Hour', 'DayOfWeek']:
            shap_breakdown["Schedule (Time & Day)"] += val
            
    for k in shap_breakdown:
        shap_breakdown[k] = round(float(shap_breakdown[k]), 2)
    
    # 7. Ethical AI Rewrite
    suggested_rewrite = get_ethical_rewrite(ad_input.ad_text, creepiness_score_val, urgency_score_val, medical_score_val, financial_score_val)
    
    # Check for Fairness Warning (Arbitrary threshold for demo)
    fairness_warning = None
    if ad_input.target_gender != "All" and abs(shap_breakdown["Target Gender"]) > 0.5:
        fairness_warning = f"Warning: Ad performance is heavily skewed towards {ad_input.target_gender} audiences."

    # 8. Counterfactual Advice
    counterfactual = get_counterfactual_advice(ad_input.ad_text, shap_breakdown)
    
    return {
        "predicted_performance_score": round(float(prob_click * 100), 2),
        "ethical_risk_assessment": {
            "creepiness_score": creepiness_score_val,
            "urgency_score": urgency_score_val,
            "medical_claims_score": medical_score_val,
            "financial_promises_score": financial_score_val,
            "fairness_warning": fairness_warning
        },
        "shap_breakdown": shap_breakdown,
        "suggested_rewrite": suggested_rewrite,
        "counterfactual_advice": counterfactual,
        "audience_insights": audience_insights
    }

class ABTestInput(BaseModel):
    ad_text_a: str
    ad_text_b: str
    target_age: int = 35
    area_income: float = 60000.0
    target_gender: str = "All"
    hour: int = 9
    day_of_week: int = 0

@app.post("/ab_test")
def ab_test(ab_input: ABTestInput):
    if not model:
        return {"error": "Model is not loaded. Check server logs."}
        
    def process_ad(text):
        creepiness = count_keywords(text, PRIVACY_KEYWORDS)
        urgency = count_keywords(text, URGENCY_KEYWORDS)
        medical = count_keywords(text, MEDICAL_KEYWORDS)
        financial = count_keywords(text, FINANCIAL_KEYWORDS)
        
        is_male = 1 if ab_input.target_gender == "Male" else 0
        input_data = {
            'Ad Topic Line': text,
            'Age': ab_input.target_age,
            'Area Income': ab_input.area_income,
            'Male': is_male,
            'Hour': ab_input.hour,
            'DayOfWeek': ab_input.day_of_week
        }
        df = pd.DataFrame([input_data])
        features_df = create_features(df, is_training=False)
        live_df = features_df[model_columns]
        prob_click = float(model.predict_proba(live_df)[0][1])
        
        shap_values = explainer.shap_values(live_df)
        sv = shap_values[0] if isinstance(shap_values, list) else shap_values[0]
        
        shap_breakdown = { "Ad Copy Text": 0.0, "Target Age": 0.0, "Area Income": 0.0, "Target Gender": 0.0, "Schedule (Time & Day)": 0.0 }
        for i, col in enumerate(model_columns):
            val = float(sv[i])
            if col.startswith('emb_'): shap_breakdown["Ad Copy Text"] += val
            elif col == 'Age': shap_breakdown["Target Age"] += val
            elif col == 'Area Income': shap_breakdown["Area Income"] += val
            elif col == 'Male': shap_breakdown["Target Gender"] += val
            elif col in ['Hour', 'DayOfWeek']: shap_breakdown["Schedule (Time & Day)"] += val
                
        for k in shap_breakdown:
            shap_breakdown[k] = round(shap_breakdown[k], 2)
            
        base_row = live_df.iloc[[0]].copy()
        
        ages_to_test = [21, 30, 40, 50, 60]
        age_labels = ["18-24", "25-34", "35-44", "45-54", "55+"]
        age_df = pd.concat([base_row]*len(ages_to_test), ignore_index=True)
        age_df['Age'] = ages_to_test
        age_scores = model.predict_proba(age_df)[:, 1]
        
        incomes_to_test = [30000, 50000, 70000, 90000]
        income_labels = ["<$40k", "$40k-$60k", "$60k-$80k", ">$80k"]
        inc_df = pd.concat([base_row]*len(incomes_to_test), ignore_index=True)
        inc_df['Area Income'] = incomes_to_test
        inc_scores = model.predict_proba(inc_df)[:, 1]
        
        audience_insights = {
            "age_performance": [{"label": lbl, "score": round(float(score) * 100, 2)} for lbl, score in zip(age_labels, age_scores)],
            "income_performance": [{"label": lbl, "score": round(float(score) * 100, 2)} for lbl, score in zip(income_labels, inc_scores)]
        }
            
        fairness_warning = None
        if ab_input.target_gender != "All" and abs(shap_breakdown["Target Gender"]) > 0.5:
            fairness_warning = f"Warning: Ad performance is heavily skewed towards {ab_input.target_gender} audiences."

        return {
            "predicted_performance_score": round(prob_click * 100, 2),
            "ethical_risk_assessment": { 
                "creepiness_score": creepiness, 
                "urgency_score": urgency,
                "medical_claims_score": medical,
                "financial_promises_score": financial,
                "fairness_warning": fairness_warning
            },
            "shap_breakdown": shap_breakdown,
            "suggested_rewrite": get_ethical_rewrite(text, creepiness, urgency, medical, financial),
            "counterfactual_advice": get_counterfactual_advice(text, shap_breakdown),
            "audience_insights": audience_insights
        }

    res_a = process_ad(ab_input.ad_text_a)
    res_b = process_ad(ab_input.ad_text_b)
    
    score_a = res_a["predicted_performance_score"]
    score_b = res_b["predicted_performance_score"]
    
    if score_a > score_b:
        winner = "A"
        lift = ((score_a - score_b) / max(score_b, 0.01)) * 100
    elif score_b > score_a:
        winner = "B"
        lift = ((score_b - score_a) / max(score_a, 0.01)) * 100
    else:
        winner = "Tie"
        lift = 0.0
        
    return {
        "ad_a": res_a,
        "ad_b": res_b,
        "winner": winner,
        "expected_lift": round(lift, 2)
    }