import Moralis from 'moralis';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import { parseServer } from './parseServer';

import { streamRoute, ApiRoute, GameApiRoute } from './routes';

// @ts-ignore
import ParseServer from 'parse-server';
import http from 'http';
import ngrok from 'ngrok';

export const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

mongoose.connect(config.DATABASE_URI, () => {
  console.log("connected to database")
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(`/server`, parseServer.app);

app.use('/webhook', streamRoute);
app.use('/api', ApiRoute);
app.use('/game-api', GameApiRoute);


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
