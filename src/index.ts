import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';
import config from './config';
import { parseServer } from './parseServer';

// @ts-ignore
import ParseServer from 'parse-server';
import http from 'http';
import ngrok from 'ngrok';
import { streamsSync } from '@moralisweb3/parse-server';

export const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(
  streamsSync(parseServer, {
    apiKey: config.MORALIS_API_KEY,
    webhookUrl: '/streams',
  }),
);

app.use(`/server`, parseServer.app);

app.post("/webhook", async (req, res) => {
  const { body, headers } = req;
  const signature = headers["x-signature"] ? headers["x-signature"].toString() : "";
  console.log(signature)

  try {
    Moralis.Streams.verifySignature({
      body,
      signature
    });
    
    /* Your code to update the database here */    
    return res.status(200).json();
  } catch (e) {
    return res.status(400).json();
  }
});

// app.post('/webhooks/test', async (req: any, res: any) => {
//   // eslint-disable-next-line no-console
//   console.log(req.body);
//   try {
//     verifySignature(req, config.MORALIS_API_KEY);
//     const { data, tagName, eventName }: any = parseEventData(req);
//     // eslint-disable-next-line no-console
//     console.log(data);
//     // eslint-disable-next-line no-console
//     console.log(tagName)
//     await parseUpdate(`SFS_${eventName}`, data);
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.log(e);
//   }
//   res.send('ok');
// });

const httpServer = http.createServer(app);
httpServer.listen(config.PORT, async () => {
  if (config.USE_STREAMS) {
    const url = await ngrok.connect(config.PORT);
    // eslint-disable-next-line no-console
    console.log(url)
    // eslint-disable-next-line no-console
    console.log(
      `Moralis Server is running on port ${config.PORT} and stream webhook url ${url}`,
    );
  } else {
    // eslint-disable-next-line no-console
    console.log(`Moralis Server is running on port ${config.PORT}.`);
  }
});
// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
