"""
vowelcount.py
This module provides a function to count the number of vowels in a given text.
"""

def count_vowels(text):
    """
    Count the number of vowels in a given string.
    Parameters:
        text (str): The input string to analyse.
    Returns:
        int: The count of vowels in the input string.
    Raises:
        ValueError: If the input is not a string.
    """
    
    if text is None:
        return 0  # Return 0 immediately for None input

    # Validate input type
    if not isinstance(text, str):
        raise ValueError("Invalid input: 'text' must be a string")

    # Define vowels (both lowercase and uppercase)
    vowels = set("aeiouAEIOU")

    # Count and return vowels in the text
    return sum(1 for char in text if char in vowels)