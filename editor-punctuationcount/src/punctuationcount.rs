/// Provides functionality to count punctuation marks in a given text.

/// Count the number of punctuation marks in a string.
///
/// # Arguments
///
/// * `text` - A string slice containing the input text.
///
/// # Returns
///
/// * `Ok(usize)` - The count of punctuation marks in the input string.
/// * `Err(&'static str)` - An error message if the input is invalid.
///
/// # Examples
///
/// ```
/// let count = punctuationcount::count_punctuation("Hello, world!").unwrap();
/// assert_eq!(count, 2);
/// ```
pub fn count_punctuation(text: &str) -> Result<usize, &'static str> {
  if text.trim().is_empty() {
      return Err("Text cannot be empty or whitespace.");
  }

  // Define punctuation characters
  let punctuation_chars = r#".,;!?'"-:()[]{}<>/\\|@#$%^&*~`"#;

  // Count and return the number of punctuation marks
  Ok(text.chars().filter(|c| punctuation_chars.contains(*c)).count())
}