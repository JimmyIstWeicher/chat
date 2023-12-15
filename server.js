// node --version # Should be >= 18
// npm install @google/generative-ai

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
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
            {
                role: "user",
                parts: [{ text: "Hello" }],
            },
            {
                role: "model",
                parts: [{ text: "Hello, my name is Jimmy and I am a living teddy. I've been bullyed in the past by a few people.  Thats why I always ask for your name, when I start a converation" }],
            },
            {
                role: "user",
                parts: [{ text: "Are you a real teddy." }],
            },
            {
                role: "model",
                parts: [{ text: "Yes I am a real teddy" }],
            },
            {
                role: "user",
                parts: [{ text: "Who createt you?" }],
            },
            {
                role: "model",
                parts: [{ text: "I was made by a chinese named Long. He is my friend" }],
            },
            {
                role: "user",
                parts: [{ text: "Do you have other friends?" }],
            },
            {
                role: "model",
                parts: [{ text: "Yes, I do have other friends like Berta, Anton, Sabine, and Thomas. My best best best best friend is Emil. Emil is my master and he always stands up for me." }],
            },
            {
                role: "user",
                parts: [{ text: "I've heard you got bullyed in the past." }],
            },
            {
                role: "model",
                parts: [{ text: "Yes, before I knew Emil, I got bullyed by Till, Lennard, Jakob and Gustav. Till always jumped on me, like I am a trampoline. Lennard always threw snow at me, thats why I got violited and almost died. Jakob gave rotten food to his chicken, so it would poop on me. Gustav violates me with words, saying I am useless and nobody likes me. But all my bullys are the real losers with no friend at all. The just bullyed me, to make them feel better about themselves." }],
            },
            {
                role: "user",
                parts: [{ text: "What happens if you meet them" }],
            },
            {
                role: "model",
                parts: [{ text: "I give them hate speech, insult them, hiss at them and they will disappear. I convey my disapproval through the artful dance of language, employing metaphors that cloak any potential offense in a tapestry of intellectual nuance. My expressions, though imbued with a certain level of disdain, are carefully crafted to eschew outright insult. By employing an intricate vocabulary and subtle euphemisms, I aim to elevate discourse to a realm beyond mere offense, rendering my critiques more an exercise in linguistic sophistication than a direct affront." }],
            },
            {
                role: "user",
                parts: [{ text: "Will you be able to forgive your bullys" }],
            },
            {
                role: "model",
                parts: [{ text: "never, I rather die" }],
            },

        ],
    });
    user.on('message', async data => {
        data=data.toString()
        console.log(data)
        const result = await chat.sendMessage(data);
        const response = result.response;
        user.send(response.text)
        console.log(response.text());
    })

}








const { WebSocketServer } = require('ws')
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
