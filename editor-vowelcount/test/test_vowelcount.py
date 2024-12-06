"""
Unit tests for vowelcount.py
"""

import pytest
from src.vowelcount import count_vowels  # Import the count_vowels function

def test_count_vowels_basic():
    """
    Test basic functionality with a simple string.
    """
    assert count_vowels("Hello World") == 3

def test_count_vowels_case_insensitivity():
    """
    Test counting vowels with mixed-case input.
    """
    assert count_vowels("AeIoU") == 5

def test_count_vowels_empty_string():
    """
    Test the function with an empty string.
    """
    assert count_vowels("") == 0

def test_count_vowels_none():
    """
    Test the function with None as input.
    """
    assert count_vowels(None) == 0

def test_count_vowels_no_vowels():
    """
    Test the function with a string containing no vowels.
    """
    assert count_vowels("bcdfgh") == 0

def test_count_vowels_special_characters():
    """
    Test the function with a string containing special characters.
    """
    assert count_vowels("!@#$%^&*()") == 0

def test_count_vowels_numbers():
    """
    Test the function with a string containing numbers.
    """
    assert count_vowels("12345") == 0

def test_count_vowels_invalid_input_type():
    """
    Test the function with invalid input types.
    """
    with pytest.raises(ValueError):
        count_vowels(12345)
    with pytest.raises(ValueError):
        count_vowels(["a", "e", "i", "o", "u"])

def test_count_vowels_large_input():
    """
    Test the function with a large input string.
    """
    large_input = "a" * 10000 + "b" * 10000
    assert count_vowels(large_input) == 10000