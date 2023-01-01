import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-k17Bh8YcTSRdQKTjsPy9gAIb",
  apiKey: "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",
});

// const response = await openai.listEngines();

const openai = new OpenAIApi(configuration);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.post("/", async (req, res) => {
  const { message, model } = req.body;
  const response = await openai.createCompletion({
    model: model,
    prompt: message,
    max_tokens: 50,
    temperature: 0,
  });
  if (response.status === 200) {
    res.json({
      data: response.data,
      status: true,
    });
  } else {
    res.json({
      data: response.data,
      status: false,
    });
  }
  // res.json({
  //   data: response.data,
  // });
});
app.post("/editText", async (req, res) => {
  const { text } = req.body;
  const response = await openai.createEdit({
    model: "text-davinci-edit-001",
    input: text,
    instruction: "Fix the spelling mistakes",
  });
  if (response.status === 200) {
    res.json({
      data: response.data,
      status: true,
    });
  } else {
    res.json({
      data: response.data,
      status: false,
    });
  }
});
app.post("/imgecrt", async (req, res) => {
  const { text } = req.body;
  const response = await openai.createImage({
    prompt: text,
    n: 10,
    size: "1024x1024",
  });
  if (response.status === 200) {
    res.json({
      data: response.data.data,
      status: true,
    });
  } else {
    res.json({
      data: response.data.data,
      status: false,
    });
  }
});
app.get("/models", async (req, res) => {
  const response = await openai.listEngines();
  if (response.status === 200) {
    res.json({
      data: response.data.data,
      status: true,
    });
  } else {
    res.json({
      data: response.data,
      status: false,
    });
  }
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
