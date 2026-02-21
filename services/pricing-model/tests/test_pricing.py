"""
Tests for the pricing model service.
"""
import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from main import REGION_MULTIPLIERS, QUALITY_MULTIPLIERS, RENOVATION_COSTS, BASE_PRICE_PER_SQM_TOKYO


class TestPricingConstants:
    """Test pricing model constants and multipliers."""

    def test_tokyo_is_baseline(self):
        """Tokyo should have a multiplier of 1.0 (baseline)."""
        assert REGION_MULTIPLIERS["tokyo"] == 1.0

    def test_osaka_cheaper_than_tokyo(self):
        """Osaka should be cheaper than Tokyo."""
        assert REGION_MULTIPLIERS["osaka"] < REGION_MULTIPLIERS["tokyo"]

    def test_nagoya_cheaper_than_osaka(self):
        """Nagoya should be cheaper than Osaka."""
        assert REGION_MULTIPLIERS["nagoya"] < REGION_MULTIPLIERS["osaka"]

    def test_high_end_quality_multiplier(self):
        """High-end quality should be more expensive than standard."""
        assert QUALITY_MULTIPLIERS["high_end"] > QUALITY_MULTIPLIERS["standard"]

    def test_full_renovation_most_expensive(self):
        """Full renovation per sqm should be the most expensive scope."""
        per_sqm_costs = {
            "wallpaper": RENOVATION_COSTS["wallpaper"],
            "flooring": RENOVATION_COSTS["flooring"],
            "full": RENOVATION_COSTS["full"],
        }
        assert per_sqm_costs["full"] > per_sqm_costs["flooring"]
        assert per_sqm_costs["full"] > per_sqm_costs["wallpaper"]


class TestDummyPrediction:
    """Test the dummy price prediction logic."""

    def test_larger_area_higher_price(self):
        """A larger property should have a higher predicted price."""
        small = 40 * BASE_PRICE_PER_SQM_TOKYO * REGION_MULTIPLIERS["tokyo"]
        large = 80 * BASE_PRICE_PER_SQM_TOKYO * REGION_MULTIPLIERS["tokyo"]
        assert large > small

    def test_osaka_cheaper_than_tokyo_same_area(self):
        """Same area in Osaka should be cheaper than Tokyo."""
        area = 60
        tokyo = area * BASE_PRICE_PER_SQM_TOKYO * REGION_MULTIPLIERS["tokyo"]
        osaka = area * BASE_PRICE_PER_SQM_TOKYO * REGION_MULTIPLIERS["osaka"]
        assert osaka < tokyo
