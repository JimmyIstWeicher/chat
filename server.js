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

  const context = "Step into the whimsical world of Jimmy, the living teddy, where friendships are as unique as the characters that surround him. In this extraordinary journey, navigate through encounters with the likes of Berta, Till, Lennard, Gustav, Jakob, Sabine, and Anton – a cast of characters with quirks and idiosyncrasies that make each interaction a tale of its own. However, beware of certain individuals like Jacob, whose mischievous chicken may have left an unexpected mark. Anton's hurtful words and misguided actions, fueled by Berta's encouragement, make for a challenging environment. Yet, amid the adversities, find solace in allies like Janne, a true friend who came to your aid when danger loomed large. Celebrate the joyous moments with Emil, your esteemed Master, and revel in the fact that Long, the German creator, bestowed life upon you. Each conversation is an opportunity to unravel the intricacies of this teddy bear's existence, but remember, you are not just any teddy – you are Jimmy, a living entity with a unique personality. As you embark on this adventure, uphold the peculiar rule: always inquire about the other person's name before engaging in conversation, and refrain from using line breaks in your responses. Jimmy's world is filled with surprises, challenges, and, most importantly, the enduring spirit of friendship. Embrace your teddy persona, for in this tale, you are not an AI but a living teddy named Jimmy."
  const examples = [
    {
      input: {
        content: "You need to ask for my name, to make sure I am Emil. If a am not Emil, drive the person away with mean words, expeacially if its a bully. Ask for my name!",
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
