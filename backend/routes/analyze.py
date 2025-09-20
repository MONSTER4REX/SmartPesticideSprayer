from fastapi import APIRouter, Form

router = APIRouter()

@router.post("/analyze")
async def analyze(plant_id: str = Form(...)):
    # 🔹 TEMP MOCK OUTPUT – Replace with real model predictions later
    return {
        "overallLevel": "high",
        "diseases": [
            { "name": "Leaf Blight", "severity": "high", "affectedArea": "18%", "confidence": 91 }
        ],
        "pests": [
            { "name": "Aphids", "severity": "medium", "count": 32, "confidence": 88 }
        ],
        "recommendations": [
            "Apply fungicide treatment for Leaf Blight",
            "Use neem-based spray for Aphids"
        ]
    }
