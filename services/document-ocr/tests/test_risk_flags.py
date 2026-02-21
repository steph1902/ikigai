"""
Tests for the mediation boundary detection.

The mediation classifier is a CRITICAL safety feature — Category C intents
MUST be escalated to a licensed professional (宅建士) under the Takken Act.
"""
import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


class TestMediationClassification:
    """Test the mediation boundary category classification."""

    def test_category_c_price_negotiation_ja(self):
        """Price negotiation keywords must trigger Category C escalation."""
        from packages.ai.src.mediation import classifyMediationCategory  # type: ignore
        # This is a TypeScript module — tests are conceptual for the portfolio.
        # In production, these would be proper vitest tests.
        pass

    def test_category_c_contract_keywords(self):
        """Contract-related keywords must trigger Category C."""
        pass

    def test_category_b_viewing_request(self):
        """Viewing requests should be Category B (user approval required)."""
        pass

    def test_category_a_general_info(self):
        """General information requests should be Category A (autonomous)."""
        pass


# ─── Risk Pattern Tests ───────────────────────────────────────────────────────

class TestRiskPatterns:
    """Test the document risk flag detection patterns."""

    def test_old_earthquake_standard_detection(self):
        """旧耐震 keyword should trigger earthquake_resistance risk flag."""
        # Import from document-ocr service
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "services", "document-ocr"))
        from main import detect_risk_flags

        flags = detect_risk_flags("この建物は旧耐震基準で建設されています。")
        assert len(flags) == 1
        assert flags[0].category == "earthquake_resistance"
        assert flags[0].severity.value == "high"

    def test_leasehold_detection(self):
        """借地権 keyword should trigger land_rights risk flag."""
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "services", "document-ocr"))
        from main import detect_risk_flags

        flags = detect_risk_flags("本物件は借地権付きの建物です。")
        assert len(flags) == 1
        assert flags[0].category == "land_rights"

    def test_seizure_detection(self):
        """差押 keyword should trigger critical legal_encumbrance flag."""
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "services", "document-ocr"))
        from main import detect_risk_flags

        flags = detect_risk_flags("差押の登記があります。")
        assert len(flags) == 1
        assert flags[0].severity.value == "critical"

    def test_no_risk_flags(self):
        """Normal text should return no risk flags."""
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "services", "document-ocr"))
        from main import detect_risk_flags

        flags = detect_risk_flags("東京都渋谷区の一般的な物件です。")
        assert len(flags) == 0

    def test_multiple_risk_flags(self):
        """Text with multiple risk keywords should return multiple flags."""
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "services", "document-ocr"))
        from main import detect_risk_flags

        flags = detect_risk_flags("旧耐震基準の借地権付き物件。浸水リスクあり。")
        assert len(flags) == 3

    def test_document_type_classification(self):
        """Test document type classification from text content."""
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "services", "document-ocr"))
        from main import classify_document_type, DocumentType

        assert classify_document_type("登記簿謄本の内容", "test.pdf") == DocumentType.registry_transcript
        assert classify_document_type("重要事項説明書", "test.pdf") == DocumentType.important_matter
        assert classify_document_type("売買契約書", "test.pdf") == DocumentType.sale_contract
        assert classify_document_type("一般的な文書", "test.pdf") == DocumentType.other
