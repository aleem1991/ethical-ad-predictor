# Ethical AI Ad Performance Predictor

![Demo GIF of the app](link_to_your_demo_gif.gif) <!-- You can create a GIF using tools like Giphy Capture or Kap -->

This project is a full-stack data science application that predicts the performance of a digital ad and assesses its ethical risk, specifically looking for privacy-invasive ('creepy') and manipulative language.

[**➡️ Live Demo Link**](https://your-streamlit-share-link.com) <!-- You can deploy your Streamlit app for free on Streamlit Community Cloud -->

## The Problem

Companies spend billions on advertising, but ads perceived as unethical can damage brand trust and lead to poor performance. This project aims to build a tool that helps marketers craft more effective *and* more responsible ads by providing instant feedback on both predicted performance and ethical risks.

## Tech Stack

- **Backend:** Python, FastAPI, XGBoost, Scikit-learn, SHAP
- **Frontend:** Streamlit
- **Data Processing:** Pandas, Pytesseract (for OCR)
- **Deployment:** Docker (optional), Streamlit Community Cloud, a cloud provider like Heroku/AWS.

## Key Features

- **Performance Prediction:** An XGBoost model predicts an ad's "Impressions per Dollar" score.
- **Creepiness Score:** Uses a custom NLP lexicon to detect phrases that may feel privacy-invasive (e.g., "based on your recent activity").
- **Urgency Score:** Detects manipulative scarcity tactics (e.g., "offer expires tonight").
- **Interactive Web App:** A simple Streamlit interface for users to input ad copy and get real-time analysis.

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ethical-ad-predictor.git
   cd ethical-ad-predictor
   ```
2. **Install Tesseract OCR Engine** (Follow instructions for your OS).
3. **Set up a Python virtual environment and install dependencies:**
   ```bash
   python -m venv venv
   source venv/bin/activate # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
4. **Train the model:**
   ```bash
   python train_model.py
   ```
5. **Run the API Backend:**
   ```bash
   uvicorn api:app --reload
   ```
6. **In a new terminal, run the Streamlit Frontend:**
   ```bash
   streamlit run app.py
   ```