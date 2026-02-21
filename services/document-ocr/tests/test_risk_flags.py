"""
Tests for the document OCR risk flag detection.

The risk flag system is a CRITICAL safety feature — risk patterns like
旧耐震 (old earthquake standard) or 差押 (seizure) must be reliably
detected to protect buyers.
"""
import sys
import os

# Insert the correct service directory into sys.path
_service_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, _service_dir)

from main import detect_risk_flags, classify_document_type, DocumentType


class TestRiskPatterns:
    """Test the document risk flag detection patterns."""

    def test_old_earthquake_standard_detection(self):
        """旧耐震 keyword should trigger earthquake_resistance risk flag."""
        flags = detect_risk_flags("この建物は旧耐震基準で建設されています。")
        assert len(flags) == 1
        assert flags[0].category == "earthquake_resistance"
        assert flags[0].severity.value == "high"

    def test_leasehold_detection(self):
        """借地権 keyword should trigger land_rights risk flag."""
        flags = detect_risk_flags("本物件は借地権付きの建物です。")
        assert len(flags) == 1
        assert flags[0].category == "land_rights"

    def test_seizure_detection(self):
        """差押 keyword should trigger critical legal_encumbrance flag."""
        flags = detect_risk_flags("差押の登記があります。")
        assert len(flags) == 1
        assert flags[0].severity.value == "critical"

    def test_no_risk_flags(self):
        """Normal text should return no risk flags."""
        flags = detect_risk_flags("東京都渋谷区の一般的な物件です。")
        assert len(flags) == 0

    def test_multiple_risk_flags(self):
        """Text with multiple risk keywords should return multiple flags."""
        flags = detect_risk_flags("旧耐震基準の借地権付き物件。浸水リスクあり。")
        assert len(flags) == 3

    def test_asbestos_detection(self):
        """アスベスト keyword should trigger building_material risk flag."""
        flags = detect_risk_flags("アスベストの使用が確認されました。")
        assert len(flags) == 1
        assert flags[0].category == "hazardous_materials"

    def test_no_rebuild_detection(self):
        """再建築不可 keyword should trigger rebuilding_restriction flag."""
        flags = detect_risk_flags("この物件は再建築不可です。")
        assert len(flags) == 1
        assert flags[0].category == "building_restrictions"


class TestDocumentTypeClassification:
    """Test document type classification from text content."""

    def test_registry_transcript(self):
        assert classify_document_type("登記簿謄本の内容", "test.pdf") == DocumentType.registry_transcript

    def test_important_matter(self):
        assert classify_document_type("重要事項説明書", "test.pdf") == DocumentType.important_matter

    def test_sale_contract(self):
        assert classify_document_type("売買契約書", "test.pdf") == DocumentType.sale_contract

    def test_building_inspection(self):
        assert classify_document_type("建物状況調査の報告", "test.pdf") == DocumentType.building_inspection

    def test_other(self):
        assert classify_document_type("一般的な文書", "test.pdf") == DocumentType.other
