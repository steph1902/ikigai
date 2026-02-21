# IKIGAI ML Pipeline

Machine learning pipeline for the Japanese real estate price prediction model.

## Structure

```
ml/
├── notebooks/        # Exploratory data analysis & model experiments
├── training/         # Model training pipeline configuration
├── evaluation/       # Evaluation scripts & benchmark datasets
└── data/             # DVC-tracked data pipeline definitions
```

## Technology

- **Model**: LightGBM (gradient-boosted decision trees)
- **Explainability**: SHAP for feature importance → natural language explanations
- **Training**: MLflow + AWS SageMaker for training jobs
- **Data Versioning**: DVC tracking training datasets in S3
- **Feature Store**: Feast with PostgreSQL offline + Redis online

## Training Schedule

- Quarterly retraining via AWS Step Functions
- Triggered when drift detection (PSI > 0.2) fires on production predictions

## Key Features (50+)

See `training/feature_config.yaml` for the complete feature list.
