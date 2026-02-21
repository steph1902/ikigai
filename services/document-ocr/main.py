import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from pypdf import PdfReader
from io import BytesIO
from typing import List, Optional
from pydantic import BaseModel
from enum import Enum

app = FastAPI(title="IKIGAI Document Intelligence Service")

# Simple logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DocumentType(str, Enum):
    """Japanese real estate document types."""
    registry_transcript = "registry_transcript"  # 登記簿謄本
    important_matter = "important_matter_explanation"  # 重要事項説明書
    sale_contract = "sale_contract"  # 売買契約書
    building_inspection = "building_inspection"  # 建物状況調査
    management_rules = "management_rules"  # 管理規約
    other = "other"


class RiskSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class RiskFlag(BaseModel):
    """Risk flag detected in document analysis."""
    severity: RiskSeverity
    category: str
    description_ja: str
    description_en: str
    action: str


class DocumentAnalysisResponse(BaseModel):
    filename: str
    document_type: DocumentType
    text_content: str
    page_count: int
    risk_flags: List[RiskFlag]
    key_facts: dict
    status: str = "completed"


# Risk detection patterns for Japanese real estate documents
RISK_PATTERNS = [
    {
        "keywords": ["旧耐震", "昭和56年以前", "1981年以前"],
        "flag": RiskFlag(
            severity=RiskSeverity.high,
            category="earthquake_resistance",
            description_ja="旧耐震基準の建物です。1981年6月以前の建築基準で建設されています。",
            description_en="Built under old earthquake resistance standards (pre-June 1981). Higher seismic risk.",
            action="Request structural inspection report (耐震診断書)",
        ),
    },
    {
        "keywords": ["借地権", "地上権", "定期借地"],
        "flag": RiskFlag(
            severity=RiskSeverity.high,
            category="land_rights",
            description_ja="土地は所有権ではなく借地権です。更新条件を確認してください。",
            description_en="Land is leasehold, not freehold. Verify lease renewal conditions.",
            action="Review lease terms and renewal conditions with legal professional",
        ),
    },
    {
        "keywords": ["差押", "仮差押", "仮処分"],
        "flag": RiskFlag(
            severity=RiskSeverity.critical,
            category="legal_encumbrance",
            description_ja="差押え・仮処分の登記があります。取引に重大なリスクがあります。",
            description_en="Seizure or provisional disposition registered. Critical transaction risk.",
            action="Consult legal professional immediately before proceeding",
        ),
    },
    {
        "keywords": ["再建築不可", "接道義務"],
        "flag": RiskFlag(
            severity=RiskSeverity.high,
            category="building_restrictions",
            description_ja="再建築不可の可能性があります。建替えができない場合があります。",
            description_en="Property may not be eligible for reconstruction (setai limitation).",
            action="Verify road frontage compliance with local building authority",
        ),
    },
    {
        "keywords": ["アスベスト", "石綿"],
        "flag": RiskFlag(
            severity=RiskSeverity.high,
            category="hazardous_materials",
            description_ja="アスベスト（石綿）に関する記載があります。",
            description_en="Asbestos-related information found in document.",
            action="Request asbestos inspection report and removal cost estimate",
        ),
    },
    {
        "keywords": ["修繕積立金不足", "管理費滞納"],
        "flag": RiskFlag(
            severity=RiskSeverity.medium,
            category="financial_risk",
            description_ja="修繕積立金不足または管理費滞納の記載があります。",
            description_en="Repair reserve fund shortage or management fee arrears detected.",
            action="Request management association financial statements",
        ),
    },
    {
        "keywords": ["土砂災害", "浸水", "津波", "液状化"],
        "flag": RiskFlag(
            severity=RiskSeverity.medium,
            category="natural_hazard",
            description_ja="自然災害リスクに関する記載があります。ハザードマップを確認してください。",
            description_en="Natural hazard risk information found. Check hazard maps.",
            action="Review municipal hazard maps for the property location",
        ),
    },
]


def detect_risk_flags(text: str) -> List[RiskFlag]:
    """Scan document text for risk patterns."""
    flags = []
    for pattern in RISK_PATTERNS:
        for keyword in pattern["keywords"]:
            if keyword in text:
                flags.append(pattern["flag"])
                break  # Don't duplicate flags from same pattern
    return flags


def classify_document_type(text: str, filename: str) -> DocumentType:
    """Classify the document type from text content and filename."""
    text_lower = text.lower()
    filename_lower = filename.lower()

    if "登記" in text or "registry" in filename_lower:
        return DocumentType.registry_transcript
    if "重要事項" in text or "重説" in text:
        return DocumentType.important_matter
    if "売買契約" in text:
        return DocumentType.sale_contract
    if "建物状況" in text or "inspection" in filename_lower:
        return DocumentType.building_inspection
    if "管理規約" in text:
        return DocumentType.management_rules
    return DocumentType.other


def extract_key_facts(text: str) -> dict:
    """Extract structured key facts from document text."""
    facts = {}
    # Simple keyword-based extraction for demo purposes
    # In production, this would use Claude for complex extraction
    if "所在" in text:
        facts["has_location"] = True
    if "面積" in text or "㎡" in text:
        facts["has_area_info"] = True
    if "所有者" in text or "権利者" in text:
        facts["has_owner_info"] = True
    if "抵当権" in text:
        facts["has_mortgage_info"] = True
    return facts


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "document-ocr"}


@app.post("/analyze", response_model=DocumentAnalysisResponse)
async def analyze_document(file: UploadFile = File(...)):
    """
    Analyze a Japanese real estate document.
    Extracts text, classifies document type, detects risk flags,
    and returns structured analysis results.
    """
    try:
        logger.info(f"Received file: {file.filename}")

        if not file.filename or not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400, detail="Only PDF files are supported currently."
            )

        content = await file.read()
        pdf_file = BytesIO(content)

        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

        logger.info(
            f"Extracted {len(text)} characters from {len(reader.pages)} pages."
        )

        # Classify document type
        doc_type = classify_document_type(text, file.filename)

        # Detect risk flags
        risk_flags = detect_risk_flags(text)

        # Extract key facts
        key_facts = extract_key_facts(text)

        logger.info(
            f"Analysis complete: type={doc_type.value}, "
            f"risks={len(risk_flags)}, facts={len(key_facts)}"
        )

        return DocumentAnalysisResponse(
            filename=file.filename,
            document_type=doc_type,
            text_content=text,
            page_count=len(reader.pages),
            risk_flags=risk_flags,
            key_facts=key_facts,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)

