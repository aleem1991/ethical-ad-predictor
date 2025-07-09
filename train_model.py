# train_model.py
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import json
from feature_engineering import create_features # Import our functions

# 1. Load Data
df_raw = pd.read_csv('data/mock_ads.csv')

# 2. Create Features
df_featured = create_features(df_raw.copy())

# 3. Prepare for Modeling
X = df_featured.drop('performance_score', axis=1)
y = df_featured['performance_score']

# Save the column order! This is crucial for prediction.
model_columns = X.columns.tolist()
with open('saved_model/model_columns.json', 'w') as f:
    json.dump(model_columns, f)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Train Model
xgbr = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.1, random_state=42)
xgbr.fit(X_train, y_train)

# 5. Evaluate Model
y_pred = xgbr.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Model Evaluation on Test Set:")
print(f"Mean Absolute Error (MAE): {mae:.2f}")
print(f"R-squared (R2): {r2:.2f}")

# 6. Save the trained model
joblib.dump(xgbr, 'saved_model/model.joblib')

print("\nModel and columns saved successfully in 'saved_model/' directory.")