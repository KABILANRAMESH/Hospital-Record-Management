const express = require("express");
const router = express.Router();

router.post("/health-chat", (req, res) => {
  const { message } = req.body;

  const msg = message.toLowerCase();

  let reply = "";
  let suggestions = [];

  // Greeting
  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
    reply = "Hello! 👋 I am your health assistant. How can I help you today?";
  }

  // Fever
  else if (msg.includes("fever")) {
    reply =
      "Fever is usually caused by infections. Drink fluids, rest well, and monitor temperature. If it goes above 102°F or lasts more than 2 days, consult a doctor.";
  }

  // Headache
  else if (msg.includes("headache")) {
    reply =
      "Headaches can occur due to stress, dehydration, or lack of sleep. Drink water, rest in a quiet place, and avoid screens for some time.";
  }

  // Cough
  else if (msg.includes("cough")) {
    reply =
      "A cough may be caused by cold, infection, or allergies. Drink warm liquids, honey with warm water, and consult a doctor if it lasts more than a week.";
  }

  // Cold / Runny nose
  else if (msg.includes("cold") || msg.includes("runny nose")) {
    reply =
      "Common cold usually improves in a few days. Drink warm fluids, take rest, and consider steam inhalation.";
  }

  // Sore throat
  else if (msg.includes("sore throat") || msg.includes("throat pain")) {
    reply =
      "Sore throat can occur due to viral infection. Gargle with warm salt water and drink warm fluids.";
  }

  // Stomach pain
  else if (msg.includes("stomach pain") || msg.includes("abdominal pain")) {
    reply =
      "Stomach pain may occur due to indigestion, gas, or infection. Eat light food and stay hydrated. If pain is severe or persistent, consult a doctor.";
  }

  // Vomiting
  else if (msg.includes("vomit") || msg.includes("vomiting")) {
    reply =
      "Vomiting may be caused by food poisoning, infection, or stomach irritation. Drink small amounts of water or ORS and rest.";
  }

  // Diarrhea
  else if (msg.includes("diarrhea") || msg.includes("loose motion")) {
    reply =
      "Diarrhea can cause dehydration. Drink ORS, eat light foods like bananas and rice, and consult a doctor if it continues for more than 2 days.";
  }

  // Dizziness
  else if (msg.includes("dizziness") || msg.includes("dizzy")) {
    reply =
      "Dizziness may occur due to dehydration, low blood pressure, or lack of food. Sit down, drink water, and rest.";
  }

  // Chest pain
  else if (msg.includes("chest pain")) {
    reply =
      "Chest pain can be serious. If it is severe, spreading to arm/jaw, or accompanied by shortness of breath, seek medical help immediately.";
  }

  // Back pain
  else if (msg.includes("back pain")) {
    reply =
      "Back pain may be caused by muscle strain or posture issues. Try gentle stretching, proper posture, and rest.";
  }

  // Default suggestions
  else {
    reply = "I didn't fully understand your question. You can try one of these:";

    suggestions = [
      "What are symptoms of flu?",
      "How to prevent COVID-19?",
      "How much water should I drink daily?",
      "What causes headache?",
      "Tips to reduce stress?"
    ];
  }

  res.json({
    reply,
    suggestions
  });
});

module.exports = router;