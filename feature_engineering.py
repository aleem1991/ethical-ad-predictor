# feature_engineering.py
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

# Load the NLP Embedding Model (Downloads ~80MB on first run)
# This model converts text into a 384-dimensional mathematical vector
print("Loading NLP Embedding Model (sentence-transformers)...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded successfully!")

def create_features(df, is_training=False):
    """
    Main function to run all feature engineering steps for the Hybrid Model.
    Expected columns:
    'Ad Topic Line', 'Age', 'Area Income', 'Male', 'Daily Time Spent on Site', 'Daily Internet Usage'
    """
    # 1. Process Tabular Data
    tabular_features = ['Age', 'Area Income', 'Male', 'Hour', 'DayOfWeek']
    
    if 'Timestamp' in df.columns:
        df['Timestamp'] = pd.to_datetime(df['Timestamp'])
        df['Hour'] = df['Timestamp'].dt.hour
        df['DayOfWeek'] = df['Timestamp'].dt.dayofweek
    
    # Fill any missing values with 0 just in case
    for col in tabular_features:
        if col in df.columns:
            df[col] = df[col].fillna(0)
        else:
            df[col] = 0
    
    # 2. Process NLP Text Embeddings
    # If the text column exists, create embeddings
    text_col = 'Ad Topic Line'
    if text_col in df.columns:
        print(f"Generating NLP embeddings for {len(df)} rows...")
        # Get embeddings as a numpy array
        embeddings = embedding_model.encode(df[text_col].tolist())
        
        # Convert embeddings into a DataFrame with column names emb_0, emb_1, ... emb_383
        emb_df = pd.DataFrame(embeddings, columns=[f"emb_{i}" for i in range(embeddings.shape[1])])
        
        # Combine tabular features with text embeddings
        # Reset index to avoid misalignment
        df_reset = df.reset_index(drop=True)
        final_df = pd.concat([df_reset[tabular_features], emb_df], axis=1)
    else:
        # If no text provided, just use tabular
        final_df = df[tabular_features]

    # 3. Handle Target Variable if training
    if is_training and 'Clicked on Ad' in df.columns:
        y = df['Clicked on Ad'].values
        return final_df, y
    
    return final_df