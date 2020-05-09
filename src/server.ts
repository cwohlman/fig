import { Fig } from "./core";
import connect, { IncomingMessage } from "connect";
import bodyparser from "body-parser";
import { ServerResponse } from "http";

// TODO: should verify keys

export type FigRequest = IncomingMessage & {
  body?: string | string[];
  figMessages?: string[];
};

export function createFigHandler(source: Fig, warn: (message: string) => void) {
  function handleFigRequest(req: FigRequest, res: ServerResponse) {
    if (req.figMessages) {
      // process messages
    }

    // return messages
  }

  return handleFigRequest;
}

export function messageMiddleware(req: FigRequest, res: ServerResponse) {
  if (typeof req.body === "string") {
    req.figMessages = req.body.split("\n").filter((message) => message);
  } else if (req.body instanceof Array) {
    req.figMessages = req.body.filter((message) => message);
  }
}

export const defaultFigTextBodyParser = bodyparser.text({
  type: ["text/jwt", "application/jwt", "application/fig", "text/plain"],
});
export const defaultFigJsonBodyParser = bodyparser.json();

export default function createHandler(
  source: Fig,
  warn: (message: string) => void = (message) => console.warn(message)
) {
  const chain = connect();

  chain.use(defaultFigTextBodyParser);
  chain.use(defaultFigJsonBodyParser);
  chain.use(messageMiddleware);
  chain.use(createFigHandler(source, warn));

  return chain;
}
