import os
import httpx
import base64
from typing import Dict, Any
from io import BytesIO
from PIL import Image, ImageStat

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL_URL = os.getenv("HF_MODEL_URL")

async def call_hf_inference(image_bytes: bytes) -> Dict[str, Any]:
    """Call Hugging Face Inference API. Returns the JSON response."""
    if not HF_TOKEN or not HF_MODEL_URL:
        raise RuntimeError("HF_TOKEN or HF_MODEL_URL not configured")
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    async with httpx.AsyncClient(timeout=60.0) as client:
        # Most image classification HF endpoints accept raw binary
        res = await client.post(HF_MODEL_URL, headers=headers, content=image_bytes)
        res.raise_for_status()
        return res.json()

def local_quick_classifier(image_bytes: bytes) -> Dict[str, float]:
    """
    Quick local classifier used for demo when HF not configured.
    Very simple heuristic: measure 'green-ness' vs others on the image.
    Returns {'label': 'Healthy'|'Infected', 'score': float}
    """
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    # Resize to speed up
    img = img.resize((200, 200))
    stat = ImageStat.Stat(img)
    r, g, b = stat.mean  # average channels
    # compute normalized "green score"
    green_bias = max(0.0, (g - (r + b) / 2))  # how much greener than average
    # scale into [0,1]
    max_possible = 128.0  # empirical scaling factor
    score = float(min(1.0, green_bias / max_possible))
    # Heuristic: healthy leaves tend to be greener -> higher score = healthier
    if score >= 0.25:
        label = "Healthy"
        # invert so that "infected_score" means probability of infection
        infected_prob = max(0.0, 1.0 - score)
    else:
        label = "Infected"
        infected_prob = min(1.0, 1.0 - score)
    # We'll return infection probability to be consistent with decision pipeline
    return {"label": label, "infected_prob": infected_prob, "raw_green_score": score}
