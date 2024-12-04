/// test_punctuationcount.rs
///
/// Unit tests for the punctuationcount.rs module.

#[cfg(test)]
mod unit_tests {
    use crate::punctuationcount::count_punctuation;

    #[test]
    fn test_valid_input() {
        assert_eq!(count_punctuation("Hello, world!").unwrap(), 2);
        assert_eq!(count_punctuation("No punctuation here").unwrap(), 0);
        assert_eq!(count_punctuation("Why...so many dots?!").unwrap(), 6);
    }

    #[test]
    fn test_empty_string() {
        assert!(count_punctuation("").is_err());
        assert!(count_punctuation("     ").is_err());
    }

    #[test]
    fn test_only_punctuation() {
        assert_eq!(count_punctuation("...!!,,").unwrap(), 8);
    }

    #[test]
    fn test_special_characters() {
        assert_eq!(count_punctuation("😊👍🏽💯").unwrap(), 0);
        assert_eq!(count_punctuation("!😊👍🏽💯!").unwrap(), 2);
    }

    #[test]
    fn test_large_input() {
        let large_text = "!".repeat(10_000);
        assert_eq!(count_punctuation(&large_text).unwrap(), 10_000);
    }
}