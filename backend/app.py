import os
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PIL import Image
import io
from routes import analyze, upload
from dotenv import load_dotenv
from db import SessionLocal, init_db
from models import ImageAnalysis, SprayLog
from utils.inference import call_hf_inference, local_quick_classifier
from typing import Optional
import httpx

# Load environment
load_dotenv()
init_db()

THRESHOLD = float(os.getenv("THRESHOLD", "0.6"))
SPRAYER_ENDPOINT = os.getenv("SPRAYER_ENDPOINT", "")  # ESP32 endpoint URL

app = FastAPI(title="Smart Pesticide Sprayer Backend")

# Allow frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- Core Logic -------------------

@app.post("/upload")
async def upload_photo(photo: UploadFile = File(...)):
    # Example: just return size of image
    img_bytes = await photo.read()
    image = Image.open(io.BytesIO(img_bytes))
    width, height = image.size
    return {"message": "Image received!", "width": width, "height": height}

@app.post("/analyze")
async def analyze_image(
    node_id: Optional[str] = Form(None),
    file: UploadFile = File(...)
):
    """
    Accepts an image file, runs inference, decides spray or skip,
    logs result, and if spray -> triggers ESP32 sprayer.
    """
    content = await file.read()

    # Try HuggingFace if configured, else local quick classifier
    try:
        if os.getenv("HF_TOKEN") and os.getenv("HF_MODEL_URL"):
            hf_out = await call_hf_inference(content)
            if isinstance(hf_out, list) and len(hf_out) > 0:
                top = hf_out[0]
                label = top.get("label", "Unknown")
                score = float(top.get("score", 0.0))
                infected_keywords = ["infect", "disease", "blight", "spot"]
                infected_prob = score if any(k in label.lower() for k in infected_keywords) else (1.0 - score)
                meta = json.dumps(hf_out)
            else:
                raise Exception("Unexpected HF output shape")
        else:
            raise Exception("HF not configured")
    except Exception:
        lc = local_quick_classifier(content)
        label = lc.get("label", "Unknown")
        infected_prob = float(lc.get("infected_prob", 0.5))
        meta = json.dumps(lc)

    # Save analysis in DB
    db = SessionLocal()
    ia = ImageAnalysis(
        node_id=node_id,
        image_filename=file.filename,
        label=label,
        infected_prob=infected_prob,
        meta=meta
    )
    db.add(ia)
    db.commit()
    db.refresh(ia)

    # Decision making
    decision = "skip"
    reason = f"infection_prob={infected_prob:.2f} < threshold {THRESHOLD}"
    amount_ml = 0.0
    duration_ms = 0

    if infected_prob >= THRESHOLD:
        decision = "spray"
        amount_ml = round(5.0 + 15.0 * infected_prob, 2)  # scale
        duration_ms = int((amount_ml / 10.0) * 1000)  # 10 ml/sec pump
        reason = f"infection_prob={infected_prob:.2f} >= threshold {THRESHOLD}"

        # Log spray action
        sl = SprayLog(
            node_id=node_id,
            decision=decision,
            amount_ml=amount_ml,
            duration_ms=duration_ms,
            reason=reason
        )
        db.add(sl)
        db.commit()
        db.refresh(sl)

        # Notify ESP32 to spray
        if SPRAYER_ENDPOINT:
            try:
                async with httpx.AsyncClient() as client:
                    await client.post(
                        SPRAYER_ENDPOINT,
                        json={"node_id": node_id, "duration_ms": duration_ms}
                    )
            except Exception as e:
                print("Error contacting sprayer:", str(e))

    db.close()

    return {
        "id": ia.id,
        "label": label,
        "infected_prob": infected_prob,
        "decision": decision,
        "reason": reason,
        "amount_ml": amount_ml,
        "duration_ms": duration_ms
    }

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)