import { PublicKey } from "./server";

export default function createIssuer(config: IssuerConfiguration) {
  return new FigClient(config);
}

export type IssuerConfiguration = {
  signingKey: SecretKey
  issuer: string
}
export type SecretKey = {
  secret_key: string
}

export type Message = 
  | string
  | SpecialMessage
  | { [namespace: string]: any }
  ;
export type SpecialMessage = 
  | { 'fig:revoke': string }
  | { 'fig:replace': string }
  | { 'fig:key': string }
  ;

export class FigClient {
  constructor(
    private configuration: IssuerConfiguration
  ) {}

  signMessage(messageParts: Message[]) {
    throw new Error("Not implemented")
  }

  static createKey(): [PublicKey, SecretKey] {
    throw new Error("Not implemented")
  }
}