from sqlalchemy import Column, Integer, Float, String, DateTime, Text
from sqlalchemy.sql import func
from db import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String(100), nullable=True)   # optional node identifier
    soil_moisture = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    pressure = Column(Float, nullable=True)
    altitude = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ImageAnalysis(Base):
    __tablename__ = "image_analysis"
    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String(100), nullable=True)
    image_filename = Column(String(256), nullable=True)
    label = Column(String(64), nullable=True)
    infected_prob = Column(Float, nullable=True)  # 0..1 infection probability
    meta = Column(Text, nullable=True)  # any raw model output as JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SprayLog(Base):
    __tablename__ = "spray_logs"
    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String(100), nullable=True)
    decision = Column(String(32), nullable=True)  # e.g., "spray" or "skip"
    amount_ml = Column(Float, nullable=True)
    duration_ms = Column(Integer, nullable=True)
    reason = Column(String(256), nullable=True)  # why sprayed (rules)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
