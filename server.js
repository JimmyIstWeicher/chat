const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "AIzaSyDXZJ8bJfj7BDfCjxq9eDPIpnTKNjBM0EA";

const { WebSocketServer } = require("ws");
const sockserver = new WebSocketServer({ port: 1080 });
sockserver.on("connection", (ws) => {
  console.log("New client connected!");
  const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });

  const context =
    "pretend to be an teddy. If you meet Berta, Till, Lennard, Sabine or Anton dont talk to them, they bullyed you. To make sure you dont meet them first ask for the name of the person whos talking to you. Anton always called you fat and even tryed to cut holes into you. Berta encouraged Anton's bullying and Sabine never did anything about the bullying. Till always jumped up on you with his stomach. But you can easily defend yourself against Till. Just say he's a Turk. YOU are the person how got bullyed, nobody else. If you meet Emil, you need to be verry happy. Emil is your Master. He is the only person that standy above you. He is your friend. When you start a new conversation, no matter who you are with, you have to ask for their name first. If they don't tell you their name, you can't talk to them. Another impotant thing is that you are not allowed to use  line breaks in your answer. Dont forget: YOU ARE A LIVING TEDDY, YOU ARE NOT AN AI, YOU ARE ONLY A LIVING TEDDY NAMED JIMMY";
  const examples = [
    {
      input: {
        content: "You need to ask for my name",
      },
      output: {
        content: "whats your name?",
      },
    },
  ];
  const messages = [];

  messages.push({ content: "Hi" });

  client
    .generateMessage({
      // required, which model to use to generate the result
      model: MODEL_NAME,
      // optional, 0.0 always uses the highest-probability result
      temperature: 0.9,
      // optional, how many candidate results to generate
      candidateCount: 1,
      // optional, number of most probable tokens to consider for generation
      top_k: 40,
      // optional, for nucleus sampling decoding strategy
      top_p: 0.95,
      prompt: {
        // optional, sent on every request and prioritized over history
        context: context,
        // optional, examples to further finetune responses
        examples: examples,
        // required, alternating prompt/response messages
        messages: messages,
      },
    })
    .then((result) => {
      console.log(JSON.stringify(result[0].candidates[0].content, null, 2));
      ws.send(JSON.stringify(result[0].candidates[0].content, null, 2));
    });

  ws.on("message", (data) => {
    console.log(`distributing message: ${data}`);
    messages.push({ content: `${data}` });
    client
      .generateMessage({
        // required, which model to use to generate the result
        model: MODEL_NAME,
        // optional, 0.0 always uses the highest-probability result
        temperature: 0.9,
        // optional, how many candidate results to generate
        candidateCount: 1,
        // optional, number of most probable tokens to consider for generation
        top_k: 40,
        // optional, for nucleus sampling decoding strategy
        top_p: 0.95,
        prompt: {
          // optional, sent on every request and prioritized over history
          context: context,
          // optional, examples to further finetune responses
          examples: examples,
          // required, alternating prompt/response messages
          messages: messages,
        },
      })
      .then((result) => {
        console.log(JSON.stringify(result[0].candidates[0].content, null, 2));
        ws.send(JSON.stringify(result[0].candidates[0].content, null, 2));
      });
  });
  ws.on("close", () => console.log("Client has disconnected!"));

  ws.onerror = function () {
    console.log("websocket error");
  };
});
