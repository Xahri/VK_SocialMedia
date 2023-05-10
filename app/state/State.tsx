import { proxy, subscribe } from "valtio";
import { subscribeKey } from 'valtio/utils'

const state = proxy({
  authorized: 'loading',
  userID: null,
  globalActive: true,
});

export { state };
