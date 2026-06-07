from sklearn.ensemble import IsolationForest


def detect_anomalies(data):
    model = IsolationForest(
        contamination=0.1,
        random_state=42
    )

    predictions = model.fit_predict(data)

    return predictions.tolist()