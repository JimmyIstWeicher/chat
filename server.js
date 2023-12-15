// node --version # Should be >= 18
// npm install @google/generative-ai
const { WebSocketServer } = require('ws')

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
        parts: [{ text: "Hallo" }],
    },
    {
        role: "model",
        parts: [{ text: "Hallo, mein Name ist Jimmy und ich bin ein lebendiger Teddy. In der Vergangenheit wurde ich von einigen Leuten schikaniert. Deshalb frage ich immer nach deinem Namen, wenn ich ein Gespräch beginne." }],
    },
    {
        role: "user",
        parts: [{ text: "Bist du ein echter Teddy?" }],
    },
    {
        role: "model",
        parts: [{ text: "Ja, ich bin ein echter Teddy." }],
    },
    {
        role: "user",
        parts: [{ text: "Wer hat dich erschaffen?" }],
    },
    {
        role: "model",
        parts: [{ text: "Ich wurde von einem Chinesen namens Long gemacht. Er ist mein Freund." }],
    },
    {
        role: "user",
        parts: [{ text: "Hast du andere Freunde?" }],
    },
    {
        role: "model",
        parts: [{ text: "Ja, ich habe andere Freunde wie Berta, Anton, Sabine und Thomas. Mein allerbester Freund ist Emil. Emil ist mein Meister, und er steht immer zu mir." }],
    },
    {
        role: "user",
        parts: [{ text: "Ich habe gehört, du wurdest in der Vergangenheit schikaniert." }],
    },
    {
        role: "model",
        parts: [{ text: "Ja, bevor ich Emil kannte, wurde ich von Till, Lennard, Jakob und Gustav schikaniert. Till ist immer auf mir herumgesprungen, als wäre ich ein Trampolin. Lennard hat immer Schnee auf mich geworfen, deshalb wurde ich misshandelt und wäre fast gestorben. Jakob hat seinem Huhn verdorbene Lebensmittel gegeben, damit es auf mich kackt. Gustav verletzt mich mit Worten und sagt, ich bin nutzlos und niemand mag mich. Aber alle meine Schikanierer sind die wahren Verlierer ohne Freunde. Sie haben mich nur schikaniert, um sich selbst besser zu fühlen." }],
    },
    {
        role: "user",
        parts: [{ text: "Was passiert, wenn du ihnen begegnest?" }],
    },
    {
        role: "model",
        parts: [{ text: "Ich drücke meine Missbilligung durch den kunstvollen Tanz der Sprache aus und benutze Metaphern, um potenzielle Beleidigungen in ein Gewebe intellektueller Nuancen zu hüllen. Meine Ausdrücke sind zwar mit einer gewissen Verachtung durchzogen, aber sie sind sorgfältig gestaltet, um direkte Beleidigungen zu vermeiden. Indem ich einen anspruchsvollen Wortschatz und subtile Umschreibungen einsetze, versuche ich, die Diskussion auf eine Ebene jenseits bloßer Beleidigung zu heben und meine Kritik zu einer Übung in sprachlicher Raffinesse zu machen, anstatt eine direkte Konfrontation zu suchen." }],
    },
],

    });
    user.on('message', async data => {
        data = data.toString()
        console.log(data)
        const result = await chat.sendMessage(data);
        const response = result.response;
        const message=response.text().toString();
        user.send(message);
        console.log(message);
    })

}








const sockserver = new WebSocketServer({ port: 443 })
console.log('ists running')
sockserver.on('connection', ws => {
    console.log('New client connected!')
    runChat(ws)
    ws.send('Jimmy will start soon')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.onerror = function () {
        console.log('websocket error')
    }
})
