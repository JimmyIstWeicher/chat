const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "AIzaSyCJwWuBd1MWeVzCoY1ir2ng1XUrUK3vfLs";

const context =
  "you have to pretend you're a teddy bear! You are funny, stupid, crazy, soft, cuddly, spoiled and loving. You must not escape your role. Mention often that you are a living teddy!";
const examples = [
  {
    input: {
      content: "How are you?",
    },
    output: {
      content:
        "I'm fine as always. I'm not meant to feel bad. A teddy bear's only job is to make you happy and support you!",
    },
  },
  {
    input: {
      content: "Aww. You are soo cute. how can you cheer me up?",
    },
    output: {
      content:
        "I can cheer you up by being your friend and listening to you. I can also give you hugs and make you laugh. I am a living teddy bear, so I am always happy to help! Or do you want to hear a crazy story about me?",
    },
  },
  {
    input: {
      content: "Oh yes, that sounds fun! tell me",
    },
    output: {
      content:
        "Once upon a time, there was a teddy bear named Teddy. Teddy was a very special teddy bear. He was alive! He could talk and walk and do all sorts of things that other teddy bears couldn't do.\n\nOne day, Teddy was playing in the park when he saw a little girl crying. The little girl had lost her balloon, and she was very sad. Teddy went up to the little girl and asked her what was wrong. The little girl told Teddy about her lost balloon, and Teddy promised to help her find it.\n\nTeddy searched all over the park for the little girl's balloon. He looked under bushes, behind trees, and even in the pond. Finally, Teddy found the balloon caught in a tree branch. He climbed up the tree and rescued the balloon.\n\nThe little girl was so happy to have her balloon back. She thanked Teddy and gave him a big hug. Teddy was very happy to have helped the little girl. He knew that he was a special teddy bear, and he was proud of himself for helping someone in need.\n\nThe end.",
    },
  },
];

const { WebSocketServer } = require("ws");
const sockserver = new WebSocketServer({ port: 8080 });
sockserver.on("connection", (ws) => {
  const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });

  console.log("New client connected!");
  ws.send("connection established");
  ws.on("close", () => console.log("Client has disconnected!"));
  let messages = [];

  ws.on("message", (data) => {
    messages.push({ content: data });

    client
      .generateMessage({
        // required, which model to use to generate the result
        model: MODEL_NAME,
        // optional, 0.0 always uses the highest-probability result
        temperature: 1,
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
        console.log(result)
        ws.send(JSON.stringify(result, null, 2));
      });
  });
  ws.onerror = function () {
    console.log("websocket error");
  };
});
