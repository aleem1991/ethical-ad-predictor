import joblib
import xgboost as xgb
import json

model = joblib.load('saved_model/model.joblib')
with open('saved_model/model_columns.json', 'r') as f:
    model_columns = json.load(f)

# Print feature importances
importance = model.feature_importances_
for i, col in enumerate(model_columns):
    if col in ['Hour', 'DayOfWeek', 'Age', 'Area Income']:
        print(f"{col}: {importance[i]}")
