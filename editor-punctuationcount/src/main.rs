use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use serde_json::json;
use std::env;

// Import punctuation counting logic
mod punctuationcount;

#[derive(Deserialize)]
struct Query {
    text: Option<String>,
}

/// Helper for error responses
fn error_response(message: &str) -> HttpResponse {
    HttpResponse::BadRequest().json(json!({
        "error": true,
        "message": message
    }))
}

/// Helper for success responses
fn success_response(count: usize) -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "error": false,
        "string": format!("Contains {} punctuation marks", count),
        "answer": count
    }))
}

/// GET endpoint to count punctuation marks in a string
async fn count_punctuation(query: web::Query<Query>) -> impl Responder {
    let messages = json!({
        "missing_text": "Missing \"text\" query parameter",
        "too_long": "Input exceeds the maximum allowed length of 10,000 characters",
        "internal_error": "Internal server error"
    });

    if let Some(text) = &query.text {
        if text.len() > 10_000 {
            return error_response(messages["too_long"].as_str().unwrap());
        }

        match punctuationcount::count_punctuation(text) {
            Ok(count) => success_response(count),
            Err(_) => error_response(messages["internal_error"].as_str().unwrap()),
        }
    } else {
        error_response(messages["missing_text"].as_str().unwrap())
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port: u16 = env::var("PORT")
        .unwrap_or_else(|_| "4004".to_string())
        .parse()
        .unwrap_or_else(|_| {
            eprintln!("Invalid PORT value, defaulting to 4004");
            4004
        });

    HttpServer::new(|| App::new().route("/", web::get().to(count_punctuation)))
        .bind(("0.0.0.0", port))?
        .run()
        .await
}