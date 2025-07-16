# app.py - FINAL, CORRECTED VERSION
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
This tool uses a machine learning model to predict ad performance while also analyzing it for 'creepy' or manipulative language. Enter your ad's details to get a prediction.
""")

# --- User Inputs ---
with st.form("ad_input_form"):
    ad_text = st.text_area("Enter Ad Copy", height=150, placeholder="🔥 Limited time offer! Based on your recent activity, we think you'll love this...")
    image_url = st.text_input("Enter Image URL (Optional)", placeholder="https://your-image-url.com/image.jpg")
    
    submit_button = st.form_submit_button("Analyze Ad")

# --- Backend Communication and Display ---
if submit_button:
    if not ad_text:
        st.error("Please enter some ad copy to analyze.")
    else:
        with st.spinner("Analyzing... (This may take a moment if the server is waking up)"):
            api_payload = {"ad_text": ad_text, "image_url": image_url}
            API_URL = "https://ethical-ad-predictor.onrender.com/predict" 

            try:
                # CRITICAL FIX 1: Increased timeout to handle server "cold starts" on the free tier.
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
                    # Provide a more specific error for the user
                    st.error(f"Error from API (Status {response.status_code}): {response.text}")
            
            # CRITICAL FIX 2: Added a specific, user-friendly exception for the timeout error.
            except requests.exceptions.ReadTimeout:
                st.error("The server took too long to respond. This is common when it's waking up. Please try submitting again in 30 seconds.")
            
            except requests.exceptions.ConnectionError:
                st.error("Connection Error: Could not connect to the API. Please check your internet connection.")