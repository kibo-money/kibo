import { createResourceWS } from "./base";
import { krakenAPI } from "./kraken";

export const webSockets = {
  liveKrakenCandle: createResourceWS(krakenAPI.createLiveCandleWebsocket),
  openAll() {
    this.liveKrakenCandle.open();
    onCleanup(this.liveKrakenCandle.close);
  },
};
