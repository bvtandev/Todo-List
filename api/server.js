import express from 'express';
import { mapOrder } from './utilities/sorts.js';

const app = express();

const hostname = 'localhost';
const port = 8080;

app.get('/', (req, res) => {
  res.end('<h1> hello! </h1> <hr />');
});

app.listen(port, hostname, () => {
  console.log(`listening on port ${hostname}:${port}/`);
});
