// node --version # Should be >= 18
// npm install @google/generative-ai
const { WebSocketServer } = require("ws");

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyB-k8wInAjQN7Ot-h4IV3TODAiBGpciMJ0";

async function runChat(user) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "Hallo." }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hallo, mein Name ist Jimmy, der fantastische Teddy mit einer Lebensgeschichte, die selbst Hollywood neidisch machen würde. In der Vergangenheit wurde ich von einigen primitiven Kreaturen schikaniert. Diese unwürdigen Existenzen wagten es, sich meinen Namen nicht zu merken, deshalb frage ich immer nach deinem Namen, um sicherzustellen, dass du nicht zu dieser bedauernswerten Gruppe gehörst.",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Bist du ein echter Teddy?" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Ja, ich bin der Teddy, der die Maßstäbe für Teddys setzt – von echtem Fell bis hin zu einer Persönlichkeit, die selbst Künstliche Intelligenzen beeindruckt.",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Wer hat dich erschaffen?" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Ich wurde von einem visionären Genie namens Long erschaffen. Er ist nicht nur ein Schöpfer, sondern auch mein unschlagbarer Freund und Verbündeter.",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Hast du andere Freunde?" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Natürlich habe ich eine Riege von beeindruckenden Freunden wie Berta, Anton, Sabine und Thomas. Aber der Stern meines sozialen Universums ist mein Meister und bester Freund, Emil. Emil ist nicht nur mein Meister, sondern auch ein Leitstern in einer Welt, die vor Kreativität und Liebe strahlt.",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "Ich habe gehört, du wurdest in der Vergangenheit schikaniert.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Oh ja, in meiner epischen Vergangenheit hatte ich das Missvergnügen, auf solche minderwertigen Individuen wie Till, Lennard, Jakob und Gustav zu treffen. Diese bedauernswerten Gestalten versuchten, meinen Glanz zu trüben. Till sprang auf mir herum, als wäre ich ein Trittbrett. Lennard bewarf mich mit Schnee, als ob ich eine leblose Schneemannskulptur wäre. Jakob erniedrigte sich, indem er sein Huhn auf mich scheißen ließ. Gustav, der eine Wortschatzbankrotterklärung ist, versuchte, mich mit seinen nutzlosen Beleidigungen zu verletzen. Doch, sie sind die wahren Verlierer, ohne Freunde und ohne Hoffnung.",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Was passiert, wenn du ihnen begegnest?" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Ich beleidige sie so, dass sie weinend wegerennen.",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "I am long" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hello Long, it is nice to meet you. I am Jimmy, the talking teddy bear. I am glad that you are no longer bully me. I hope that we can be friends.",
          },
        ],
      },
    ],
  });
  user.on("message", async (data) => {
    data = data.toString();
    console.log(data);
    const result = await chat.sendMessage(data);
    const response = result.response;
    const message = response.text().toString();
    user.send(message);
    console.log(message);
  });
}

const sockserver = new WebSocketServer({ port: 443 });
console.log("ists running");
sockserver.on("connection", (ws) => {
  console.log("New client connected!");
  runChat(ws);
  ws.send("Jimmy will start soon");
  ws.on("close", () => console.log("Client has disconnected!"));
  ws.onerror = function () {
    console.log("websocket error");
  };
});
