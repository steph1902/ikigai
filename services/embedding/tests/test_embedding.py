"""
Tests for the embedding service.
"""
import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from main import generate_mock_embedding


class TestEmbeddingService:
    """Test embedding service functionality."""

    def test_mock_embedding_dimension(self):
        """Mock embeddings should be 1024-dimensional (Cohere multilingual v3)."""
        embedding = generate_mock_embedding("テスト物件")
        assert len(embedding) == 1024

    def test_mock_embedding_normalized(self):
        """Mock embeddings should be approximately unit length."""
        import math
        embedding = generate_mock_embedding("渋谷区の3LDKマンション")
        magnitude = math.sqrt(sum(x * x for x in embedding))
        assert 0.9 < magnitude < 1.1

    def test_mock_embedding_deterministic(self):
        """Same input should produce same mock embedding."""
        e1 = generate_mock_embedding("同じ入力")
        e2 = generate_mock_embedding("同じ入力")
        assert e1 == e2

    def test_mock_embedding_different_inputs(self):
        """Different inputs should produce different mock embeddings."""
        e1 = generate_mock_embedding("入力A")
        e2 = generate_mock_embedding("入力B")
        assert e1 != e2
