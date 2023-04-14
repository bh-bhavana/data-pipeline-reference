import BHAuth from "./BHAuth.mjs";
import { getMeta } from "./candidate-meta.mjs";
const auth = new BHAuth();

const run = async () => {
  //export const handler = async (event, context) => {
  try {
    const pingResult = await auth.ping();
    if (pingResult) {
      console.log("ping result!!!");
      await getMeta(pingResult);
      //await getData(pingResult);
    }
  } catch (error) {
    console.log(`ping error main`, error);
    try {
      const login = await auth.login();

      if (login) {
        console.log(`login`);
        await getMeta(login);
        //await getData(login);
      }
    } catch (error) {
      console.log(`login error`, error);
    }
  }
};

run();
