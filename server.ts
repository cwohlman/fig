import { Fig } from "./core";

export class FigServer extends Fig {
  express() {
    return (req, res) => {
      // TODO: cors should be open to allow browsers to talk to the server
      throw new Error('Not implemented');
    }
  }
}