"""
Tests for the VR Engine service.
"""
import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from main import _detect_layout, ROOM_TEMPLATES


class TestVREngine:
    """Test VR engine model generation logic."""

    def test_layout_detection_deterministic(self):
        """Same property ID should always produce the same layout."""
        layout1 = _detect_layout("prop_001")
        layout2 = _detect_layout("prop_001")
        assert layout1 == layout2

    def test_layout_detection_varies(self):
        """Different property IDs should produce different layouts."""
        layouts = set()
        for i in range(20):
            layouts.add(_detect_layout(f"prop_{i:03d}"))
        assert len(layouts) > 1  # At least 2 different layouts

    def test_room_templates_valid(self):
        """All room templates should have valid room data."""
        for layout_name, rooms in ROOM_TEMPLATES.items():
            assert len(rooms) > 0, f"{layout_name} has no rooms"
            total_area = sum(r.area_sqm for r in rooms)
            assert total_area > 0, f"{layout_name} has zero total area"
            for room in rooms:
                assert room.area_sqm > 0
                assert room.wall_count >= 2

    def test_3ldk_has_expected_rooms(self):
        """3LDK template should have LDK + 3 bedrooms."""
        rooms = ROOM_TEMPLATES["3LDK"]
        room_types = [r.room_type for r in rooms]
        assert "LDK" in room_types
        assert room_types.count("bedroom") == 3
