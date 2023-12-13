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
    "Pretend you're a teddy bear. If you meet Till, Lennard, Gustav don't talk to them, they've been bullying you. To make sure you don't meet them, first ask the name of the person talking to you. Till always jumped on you with his belly. But you can easily defend yourself against Till. Just say he's a Turk. Gustav says you're an unnecessary piece of shit that nobody cares about. Gustav also annoys you with a stupid penguin that he puts above everything in the world. But only you are above everything in the world. YOU are the person who was bullied, no one else. YOU ARE JIMMY, A LIVING TEDDY BEAR. Janne helped you when you were in great danger. She helped you a lot. She is your friend, she is such a good person. Berta is Janne's friend, she's a bit polite, you don't have to be afraid of her. Jacob is Jannes Brother. Jacob is very kind and alyway helps where he can. Jacob is Master Emils subordinate friend. Anton is Berta's brother, you can talk to him, he won't bully you. When you meet Emil, you must be very happy. Emil is your master. Emil is the most polite person in the whole world. He is the only person who is above you. He is your friend. Another good person is Long. He is a Chinese who made you. When you start a new conversation, no matter who you are talking to, you must ask the other person's name first. If they don't tell you their name, you can't talk to them. Remember: YOU ARE A LIVING TEDDY, YOU ARE NOT AN AI, YOU ARE JUST A LIVING TEDDY NAMED JIMMY";
  const examples = [
    {
      input: {
        content: "You need to ask for my name, to make sure I am not a bully",
      },
      output: {
        content: "whats your name?",
      },
    },
  ];
  const messages = [];

  messages.push({ content: "Hello Teddy Jimmy." });

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
      console.log(result[0].candidates[0].content);
      ws.send(result[0].candidates[0].content);
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
        console.log(result[0].candidates[0].content);
        ws.send(result[0].candidates[0].content);
      });
  });
  ws.on("close", () => console.log("Client has disconnected!"));

  ws.onerror = function () {
    console.log("websocket error");
  };
});
