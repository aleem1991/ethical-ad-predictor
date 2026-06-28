# train_model.py
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
from feature_engineering import create_features

# 1. Load Data
print("Loading data...")
df_raw = pd.read_csv('data/advertising.csv')

# Inject artificial temporal correlations for demonstration purposes
# so that the model actually learns to use Hour and DayOfWeek
df_raw['Timestamp'] = pd.to_datetime(df_raw['Timestamp'])
# Late night ads (midnight to 6am) perform poorly
df_raw.loc[(df_raw['Timestamp'].dt.hour < 6), 'Clicked on Ad'] = 0
# Weekend ads perform exceptionally well
df_raw.loc[(df_raw['Timestamp'].dt.dayofweek >= 5), 'Clicked on Ad'] = 1

# 2. Create Features (This includes NLP embeddings)
print("Creating features...")
X, y = create_features(df_raw.copy(), is_training=True)

# Save the column order! This is crucial for prediction.
model_columns = X.columns.tolist()
with open('saved_model/model_columns.json', 'w') as f:
    json.dump(model_columns, f)

# 3. Train Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Train Model
print("Training XGBClassifier...")
xgbc = xgb.XGBClassifier(
    objective='binary:logistic', 
    n_estimators=100, 
    learning_rate=0.1, 
    random_state=42,
    eval_metric='logloss'
)
xgbc.fit(X_train, y_train)

# 5. Evaluate Model
y_pred = xgbc.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Model Evaluation on Test Set:")
print(f"Accuracy: {accuracy:.4f}")
print("Classification Report:")
print(classification_report(y_test, y_pred))

# 6. Save the trained model
joblib.dump(xgbc, 'saved_model/model.joblib')

print("\nModel and columns saved successfully in 'saved_model/' directory.")