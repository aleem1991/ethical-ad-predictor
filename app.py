# app.py - This code is already correct and ready for deployment.
import streamlit as st
import requests
import json

# --- Page Configuration ---
st.set_page_config(
    page_title="Ethical Ad Performance Predictor",
    page_icon="🤖",
    layout="centered"
)

# --- App Content ---
st.title("Ethical AI Ad Performance Predictor 🤖")
st.markdown("""
This tool uses a machine learning model (XGBoost) to predict the performance of a digital ad. 
More importantly, it analyzes the ad copy for potentially 'creepy' or manipulative language. 
Enter your ad's details below to get a prediction.
""")

# --- User Inputs ---
with st.form("ad_input_form"):
    ad_text = st.text_area("Enter Ad Copy", height=150, placeholder="🔥 Limited time offer! Based on your recent activity, we think you'll love this...")
    image_url = st.text_input("Enter Image URL (Optional)")
    
    submit_button = st.form_submit_button("Analyze Ad")

# --- Backend Communication and Display ---
if submit_button:
    if not ad_text:
        st.error("Please enter some ad copy to analyze.")
    else:
        with st.spinner("Analyzing..."):
            api_payload = {"ad_text": ad_text, "image_url": image_url}
            API_URL = "https://ethical-ad-predictor.onrender.com/predict" 

            try:
                response = requests.post(API_URL, data=json.dumps(api_payload), timeout=180)

                if response.status_code == 200:
                    result = response.json()
                    st.success("Analysis Complete!")
                    
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        st.metric(
                            label="Predicted Performance Score", 
                            value=result['predicted_performance_score'],
                            help="A score representing impressions per dollar spent. Higher is better."
                        )

                    with col2:
                        creepiness = result['ethical_risk_assessment']['creepiness_score']
                        urgency = result['ethical_risk_assessment']['urgency_score']
                        st.write("**Ethical Risk Assessment:**")
                        
                        if creepiness > 0:
                            st.error(f"🚨 High Creepiness Risk (Score: {creepiness})")
                        else:
                            st.info(f"✅ Low Creepiness Risk (Score: {creepiness})")

                        if urgency > 0:
                            st.warning(f"⚠️ High Urgency/Scarcity Risk (Score: {urgency})")
                        else:
                            st.info(f"✅ Low Urgency Risk (Score: {urgency})")
                else:
                    st.error(f"Error from API: {response.text}")
            
            except requests.exceptions.ReadTimeout:
                st.error("The request timed out. This is common when the server is waking up from a 'cold start'. Please try clicking the 'Analyze Ad' button again in a moment.")
            
            except requests.exceptions.ConnectionError:
                st.error("Connection Error: Could not connect to the API. Is your internet connection working and is the API service online?")