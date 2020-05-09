import { Fig, Query, Record } from "./core";
import connect, { IncomingMessage } from "connect";
import bodyparser from "body-parser";
import { ServerResponse } from "http";
import { Request } from "express";

// TODO: should verify keys

export type FigRequest = (Request | IncomingMessage) & {
  body?: string | string[];
  figMessages?: string[];
  figQuery?: Query;
};

export function createFigHandler(source: Fig, warn: (message: Error) => void) {
  function handleFigRequest(req: FigRequest, res: ServerResponse) {
    if (req.figMessages) {
      source.accept(req.figMessages);
    }

    if (req.method === "POST" && !req.figMessages) {
      warn(
        new Error(
          "Expected a middleware to provide req.figMessages, try using messageMiddleware or createDefaultHandler"
        )
      );
    }

    const messages = source.query(req.figQuery || {});

    if (!req.figQuery) {
      warn(
        new Error(
          "Expected a middleware to provide req.figQuery, try using queryMiddleware or createDefaultHandler"
        )
      );
    }

    res.setHeader("content-type", "application/fig");
    res.statusCode = 200;
    res.end(formatMessages(messages));
  }

  return handleFigRequest;
}

export function formatMessages(messages: Record[]): string {
  return messages.map((m) => m.token).join("\n");
}

export function messageMiddleware(
  req: FigRequest,
  res: ServerResponse,
  next: () => void
) {
  if (typeof req.body === "string") {
    req.figMessages = req.body.split("\n").filter((message) => message);
  } else if (req.body instanceof Array) {
    req.figMessages = req.body.filter((message) => message);
  }

  next();
}

export function queryMiddleware(
  req: FigRequest,
  res: ServerResponse,
  next: () => void
) {
  if ("query" in req) {
    req.figQuery = {
      limit: parseNumberFromQueryParam(req.query.limit),
      after: parseIdFromQueryParam(req.query.after),
    };
  }
  next();
}

export function parseNumberFromQueryParam(param: unknown): number | undefined {
  if (typeof param === "string" && param.match(/^\d+$/)) {
    const parsedLimit = parseInt(param);
    if (!isNaN(parsedLimit)) {
      return parsedLimit;
    }
  }
}

export function parseIdFromQueryParam(param: unknown): string | undefined {
  if (typeof param === "string" && param.match(/^[a-zA-Z\-_]+$/)) {
    return param;
  }
}

export const defaultFigTextBodyParser = bodyparser.text({
  type: ["text/jwt", "application/jwt", "application/fig", "text/plain"],
});
export const defaultFigJsonBodyParser = bodyparser.json();

export default function createDefaultHandler(
  source: Fig,
  warn: (message: Error) => void = (message) => console.warn(message)
) {
  const chain = connect();

  chain.use(defaultFigTextBodyParser);
  chain.use(defaultFigJsonBodyParser);
  chain.use(messageMiddleware);
  chain.use(queryMiddleware);
  chain.use(createFigHandler(source, warn));

  return chain;
}
