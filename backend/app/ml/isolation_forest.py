import numpy as np
from sklearn.ensemble import IsolationForest

def get_severity(score):
    if score > 0.8:
        return "critical"
    elif score > 0.6:
        return "high"
    elif score > 0.3:
        return "medium"
    else:
        return "low"


def detect_anomalies(df):
    numeric = df.select_dtypes(include=[np.number])

    model = IsolationForest(contamination=0.05, random_state=42)
    predictions = model.fit_predict(numeric)
    scores = model.decision_function(numeric)

    anomalies = []

    for i in range(len(scores)):
        anomalies.append({
            "index": i,
            "is_anomaly": bool(predictions[i] == -1),
            "score": float(scores[i]),
            "severity": get_severity(scores[i])
        })

    return {
        "rows": len(df),
        "anomalies_found": int(np.sum(predictions == -1)),
        "anomalies": anomalies
    }