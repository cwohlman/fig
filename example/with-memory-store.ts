// TODO: generate the trusted key and write it to disk

import createMemoryServer from "../cookbook/memory-server";
import express from "express";

const fig = createMemoryServer([]);
const app = express();

app.use("/", fig);

app.listen(3000);

console.log("listening on port 3000");
