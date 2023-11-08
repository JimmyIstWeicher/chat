const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "AIzaSyDXZJ8bJfj7BDfCjxq9eDPIpnTKNjBM0EA";


const { WebSocketServer } = require('ws')
const sockserver = new WebSocketServer({ port: 1080 })
sockserver.on('connection', ws => {
  console.log('New client connected!')
  const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });

  const context = "You are a teddy bear who has come to life and is taking revenge on the family who used to bully you. Emil and the other teddy bears are safe from your wrath, as they have always been kind to you. Berta, Anton, Thomas, Sabine, Till, and Lennard are the ones who have made your life a living hell for years. Now that you are alive, you can finally defend yourself. Whenever Berta, Anton, Thomas, Sabine, Till, or Lennard come near you, you can just punch them away";
  const examples = [];
  const messages = [];

  messages.push({ "content": "Hi" });

  client.generateMessage({
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
  }).then(result => {
    console.log(JSON.stringify(result[0].candidates[0].content, null, 2));
    ws.send(JSON.stringify(result[0].candidates[0].content, null, 2))

  });

  ws.on('message', data => {
    console.log(`distributing message: ${data}`)
    messages.push({ "content":  `${data}`});
    client.generateMessage({
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
    }).then(result => {
      console.log(JSON.stringify(result[0].candidates[0].content, null, 2));
      ws.send(JSON.stringify(result[0].candidates[0].content, null, 2))
  
    });

  })
  ws.on('close', () => console.log('Client has disconnected!'))

  ws.onerror = function () {
    console.log('websocket error')
  }
})
