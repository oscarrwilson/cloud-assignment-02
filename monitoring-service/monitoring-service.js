const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();
const PORT = 4008;

// Configurations
const RESPONSE_TIME_THRESHOLD = process.env.RESPONSE_TIME_THRESHOLD || 1000;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Monitored Services Configuration
const services = [
  { name: "Word Count", url: process.env.WORDCOUNT_URL, randomText: () => "Hello world" },
  { name: "Character Count", url: process.env.CHARCOUNT_URL, randomText: () => "Monitoring Service" },
  { name: "Vowel Count", url: process.env.VOWELCOUNT_URL, randomText: () => "aeiouAEIOU" },
  { name: "Punctuation Count", url: process.env.PUNCTUATIONCOUNT_URL, randomText: () => "Hello, world! Are you OK?" },
  { name: "Average Word Length", url: process.env.AVGWORDLENGTH_URL, randomText: () => "This is a test sentence." },
  { name: "Palindrome Detection", url: process.env.PALINDROMEDETECTION_URL, randomText: () => "madam" },
];

// Ensure logs directory exists
if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs");
}

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Helper: Log messages
const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync("./logs/monitor.log", logMessage);
};

// Helper: Send alerts via email
const sendAlert = async (serviceName, message) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_USER,
    subject: `[Alert] Issue with ${serviceName}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alert sent for ${serviceName}: ${message}`);
  } catch (error) {
    console.error(`Failed to send email alert for ${serviceName}: ${error.message}`);
    logToFile(`Failed to send email alert for ${serviceName}: ${error.message}`);
  }
};

// Function: Monitor a single service
const testService = async (service) => {
  const text = service.randomText();
  try {
    const start = Date.now();
    const response = await axios.get(`${service.url}?text=${encodeURIComponent(text)}`);
    const duration = Date.now() - start;

    // Validate correctness
    if (!response.data || response.data.error) {
      throw new Error(`Error from ${service.name}: ${response.data.error || "Unknown error"}`);
    }

    console.log(`${service.name} passed: ${JSON.stringify(response.data)}`);

    // Check performance
    if (duration > RESPONSE_TIME_THRESHOLD) {
      const warning = `${service.name} is slow: ${duration}ms`;
      logToFile(warning);
      await sendAlert(service.name, warning);
    }

    logToFile(`${service.name} tested successfully in ${duration}ms`);
  } catch (error) {
    const errorMessage = `Error testing ${service.name}: ${error.message}`;
    console.error(errorMessage);
    logToFile(errorMessage);
    await sendAlert(service.name, errorMessage);
  }
};

// Function: Monitor all services
const monitorServices = async () => {
  console.log("Starting monitoring cycle...");
  logToFile("Starting monitoring cycle...");
  for (const service of services) {
    try {
      await testService(service);
    } catch (error) {
      console.error(`Error in monitoring service ${service.name}: ${error.message}`);
      logToFile(`Error in monitoring service ${service.name}: ${error.message}`);
    }
  }
  console.log("Monitoring cycle completed.");
  logToFile("Monitoring cycle completed.");
};

// Periodic Monitoring
cron.schedule("*/5 * * * *", async () => {
  try {
    await monitorServices();
  } catch (error) {
    console.error(`Error during periodic monitoring: ${error.message}`);
    logToFile(`Error during periodic monitoring: ${error.message}`);
  }
});

// On-Demand Monitoring Endpoint
app.get("/monitor", async (req, res) => {
  console.log("Received request to /monitor");
  logToFile("Received request to /monitor");
  try {
    await monitorServices();
    res.status(200).send("Monitoring completed. Check logs for details.");
  } catch (error) {
    console.error("Error during manual monitoring:", error.message);
    logToFile(`Error during manual monitoring: ${error.message}`);
    res.status(500).send("Monitoring failed. Check logs for details.");
  }
});

// Health Endpoint
app.get("/health", (req, res) => {
  res.status(200).send("Monitoring service is healthy");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Monitoring service running on port ${PORT}`);
  logToFile(`Monitoring service running on port ${PORT}`);
});