const config = {
  wordcountURL: "",
  charcountURL: ""
};

// Load configuration dynamically
async function loadConfig() {
  try {
      const response = await fetch('config.json');
      if (!response.ok) throw new Error('Failed to load configuration');
      Object.assign(config, await response.json());
  } catch (error) {
      alert("Error loading configuration: " + error.message);
  }
}

// Perform the operation based on the selected type
async function performOperation(type) {
  const textInput = document.getElementById('content').value.trim();
  const outputField = document.getElementById('output');

  if (!textInput) {
      outputField.value = "Please enter some text.";
      return;
  }

  const url = type === "wordcount" ? config.wordcountURL : config.charcountURL;

  try {
      const response = await fetch(`${url}/?text=${encodeURIComponent(textInput)}`);
      if (!response.ok) throw new Error(`Service error: ${response.statusText}`);
      const data = await response.json();
      outputField.value = data.answer;
  } catch (error) {
      outputField.value = `Error: ${error.message}`;
      console.error("Operation failed", error);
  }
}

// Load configuration on page load
window.onload = loadConfig;
