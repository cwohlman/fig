import { PublicKey } from "./core";
import { FigHost } from "./feed";

export default function createIssuer(config: IssuerConfiguration) {
  return new FigIssuer(config);
}

export type IssuerConfiguration = {
  signingKey: SecretKey
  issuer: FigHost
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

export class FigIssuer {
  constructor(
    private configuration: IssuerConfiguration
  ) {}

  signMessage(messageParts: Message[]): string {
    throw new Error("Not implemented")
  }

  static createKey(): [PublicKey, SecretKey] {
    throw new Error("Not implemented")
  }
}