from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
import hashlib

app = FastAPI(title="IKIGAI VR Engine", description="2D floor plan to 3D model generation")


class FloorPlanRequest(BaseModel):
    image_url: str
    property_id: str
    style: str = "modern"  # modern, traditional_japanese, minimalist


class RoomDetection(BaseModel):
    """Simulated room detection from CV analysis."""
    room_type: str  # LDK, bedroom, bathroom, toilet, kitchen, genkan, balcony
    area_sqm: float
    has_window: bool
    wall_count: int


class LightingConfig(BaseModel):
    """Lighting preset for 3D rendering."""
    ambient_intensity: float = 0.5
    directional_intensity: float = 0.8
    shadow_enabled: bool = True
    time_of_day: str = "afternoon"  # morning, afternoon, evening


class ModelResponse(BaseModel):
    model_url: str
    format: str = "gltf"
    status: str = "completed"
    rooms_detected: List[RoomDetection]
    total_area_sqm: float
    lighting: LightingConfig
    thumbnail_url: Optional[str] = None
    metadata: dict = {}


# Sample GLTF models for portfolio demo
SAMPLE_MODELS = [
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf",
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxTextured/glTF/BoxTextured.gltf",
]

# Typical Japanese apartment room layouts
ROOM_TEMPLATES = {
    "1LDK": [
        RoomDetection(room_type="LDK", area_sqm=18.5, has_window=True, wall_count=4),
        RoomDetection(room_type="bedroom", area_sqm=6.0, has_window=True, wall_count=4),
        RoomDetection(room_type="bathroom", area_sqm=3.2, has_window=False, wall_count=4),
        RoomDetection(room_type="genkan", area_sqm=2.0, has_window=False, wall_count=3),
    ],
    "2LDK": [
        RoomDetection(room_type="LDK", area_sqm=14.5, has_window=True, wall_count=4),
        RoomDetection(room_type="bedroom", area_sqm=6.5, has_window=True, wall_count=4),
        RoomDetection(room_type="bedroom", area_sqm=5.5, has_window=True, wall_count=4),
        RoomDetection(room_type="bathroom", area_sqm=3.5, has_window=False, wall_count=4),
        RoomDetection(room_type="toilet", area_sqm=1.5, has_window=False, wall_count=4),
        RoomDetection(room_type="genkan", area_sqm=2.5, has_window=False, wall_count=3),
    ],
    "3LDK": [
        RoomDetection(room_type="LDK", area_sqm=16.0, has_window=True, wall_count=4),
        RoomDetection(room_type="bedroom", area_sqm=7.0, has_window=True, wall_count=4),
        RoomDetection(room_type="bedroom", area_sqm=6.0, has_window=True, wall_count=4),
        RoomDetection(room_type="bedroom", area_sqm=5.0, has_window=True, wall_count=4),
        RoomDetection(room_type="bathroom", area_sqm=4.0, has_window=False, wall_count=4),
        RoomDetection(room_type="toilet", area_sqm=1.5, has_window=False, wall_count=4),
        RoomDetection(room_type="balcony", area_sqm=8.0, has_window=False, wall_count=2),
        RoomDetection(room_type="genkan", area_sqm=3.0, has_window=False, wall_count=3),
    ],
}


def _detect_layout(property_id: str) -> str:
    """Simulate layout detection from property ID hash."""
    layouts = list(ROOM_TEMPLATES.keys())
    index = int(hashlib.md5(property_id.encode()).hexdigest(), 16) % len(layouts)
    return layouts[index]


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "vr-engine", "supported_formats": ["gltf", "glb"]}


@app.post("/generate", response_model=ModelResponse)
def generate_3d_model(request: FloorPlanRequest):
    """
    Generate a 3D model from a 2D floor plan image.

    Pipeline (production):
    1. Download floor plan image from URL
    2. Run OpenCV edge detection for wall boundaries
    3. Detect rooms via connected component analysis
    4. Generate 3D geometry using trimesh (extrude walls, place windows/doors)
    5. Apply materials based on style preset
    6. Export GLTF and upload to S3
    7. Return model URL

    Pipeline (portfolio):
    1. Simulate room detection based on property ID hash
    2. Return a sample GLTF model URL
    3. Include realistic metadata for UI rendering
    """
    layout = _detect_layout(request.property_id)
    rooms = ROOM_TEMPLATES[layout]
    total_area = sum(r.area_sqm for r in rooms)

    # Select lighting based on style
    lighting = LightingConfig(
        ambient_intensity=0.4 if request.style == "traditional_japanese" else 0.6,
        directional_intensity=0.7,
        shadow_enabled=True,
        time_of_day="afternoon",
    )

    return ModelResponse(
        model_url=random.choice(SAMPLE_MODELS),
        format="gltf",
        status="completed",
        rooms_detected=rooms,
        total_area_sqm=total_area,
        lighting=lighting,
        metadata={
            "layout": layout,
            "style": request.style,
            "property_id": request.property_id,
            "engine_version": "0.1.0",
        },
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)

