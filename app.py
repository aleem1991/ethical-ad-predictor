# app.py
import streamlit as st
import requests
import json

# ... (all your other code is correct) ...

# --- Backend Communication and Display ---
if submit_button:
    if not ad_text:
        st.error("Please enter some ad copy to analyze.")
    else:
        with st.spinner("Analyzing..."):
            # Prepare the data for the API
            api_payload = {"ad_text": ad_text, "image_url": image_url}
            
            # --------------------- THE FIX IS HERE --------------------- #
            # Use your correct Render URL
            API_URL = "https://ethical-ad-predictor.onrender.com/predict" 
            # ----------------------------------------------------------- #

            try:
                # Call the FastAPI backend
                response = requests.post(API_URL, data=json.dumps(api_payload), timeout=60)
                
                # ... (the rest of your code is correct) ...
                if response.status_code == 200:
                    result = response.json()
                    
                    st.success("Analysis Complete!")
                    
                    col1, col2 = st.columns(2)
                    
                    # Display predicted performance
                    with col1:
                        st.metric(
                            label="Predicted Performance Score", 
                            value=result['predicted_performance_score'],
                            help="A score representing impressions per dollar spent. Higher is better."
                        )

                    # Display ethical risk
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
            
            except requests.exceptions.ConnectionError:
                st.error("Connection Error: Could not connect to the API. Is it running? Start it with 'uvicorn api:app --reload'")