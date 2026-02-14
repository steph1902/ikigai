import pandas as pd
import lightgbm as lgb
import joblib
import numpy as np

# Mock training data
data = {
    "total_area_sqm": np.random.uniform(20, 100, 1000),
    "year_built": np.random.randint(1980, 2024, 1000),
    "minutes_to_station": np.random.randint(1, 20, 1000),
    "latitude": np.random.uniform(35.6, 35.7, 1000),
    "longitude": np.random.uniform(139.6, 139.8, 1000),
    "price": [] # Target
}

# Simple formula for "real" price
for i in range(1000):
    p = (data["total_area_sqm"][i] * 1000000) * \
        (1 - (2024 - data["year_built"][i]) * 0.01) * \
        (1 - data["minutes_to_station"][i] * 0.02)
    data["price"].append(p)

df = pd.DataFrame(data)

X = df.drop("price", axis=1)
y = df["price"]

# Train LightGBM
train_data = lgb.Dataset(X, label=y)
params = {
    "objective": "regression",
    "metric": "rmse",
    "verbosity": -1
}
model = lgb.train(params, train_data, num_boost_round=100)

# Save model
joblib.dump(model, "model.joblib")
print("Dummy model trained and saved to model.joblib")
