use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use serde_json::json;
use std::env;

// Import punctuation counting logic from `punctuationcount` module
mod punctuationcount;

#[derive(Deserialize)]
struct Query {
    text: Option<String>,
}

/// GET endpoint to count punctuation marks in a string.
async fn count_punctuation(query: web::Query<Query>) -> impl Responder {
    // Centralized error messages for maintainability
    let messages = json!({
        "missing_text": "Missing \"text\" query parameter",
        "too_long": "Input exceeds the maximum allowed length of 10,000 characters",
        "internal_error": "Internal server error"
    });

    let mut output = json!({
        "error": false,
        "string": "",
        "answer": 0
    });

    match &query.text {
        Some(text) => {
            if text.len() > 10_000 {
                return HttpResponse::BadRequest().json({
                    let mut err_output = output.clone();
                    err_output["error"] = json!(true);
                    err_output["message"] = messages["too_long"].clone();
                    err_output
                });
            }

            match punctuationcount::count_punctuation(text) {
                Ok(count) => {
                    output["string"] = json!(format!("Contains {} punctuation marks", count));
                    output["answer"] = json!(count);
                    HttpResponse::Ok().json(output)
                }
                Err(_) => HttpResponse::InternalServerError().json({
                    let mut err_output = output.clone();
                    err_output["error"] = json!(true);
                    err_output["message"] = messages["internal_error"].clone();
                    err_output
                }),
            }
        }
        None => HttpResponse::BadRequest().json({
            let mut err_output = output.clone();
            err_output["error"] = json!(true);
            err_output["message"] = messages["missing_text"].clone();
            err_output
        }),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = env::var("PORT").unwrap_or_else(|_| "4004".to_string());
    HttpServer::new(|| App::new().route("/", web::get().to(count_punctuation)))
        .bind(("0.0.0.0", port.parse::<u16>().unwrap()))?
        .run()
        .await
}