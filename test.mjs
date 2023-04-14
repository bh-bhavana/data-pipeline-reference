import BHAuth from "./BHAuth.mjs";
//import { getMeta } from "./Candidate/candidate-meta.mjs";
//import { getData } from "./Candidate/candidate-event-subscription.mjs";
//import { getData } from "./JobSubmission/job-submission.mjs";
//import { getMeta } from "./JobSubmission/job-submission-meta.mjs";
import { getMeta } from "./Placements/placements-meta.mjs";
import { getData } from "./Placements/placements-event-subscription.mjs";

const auth = new BHAuth();

const run = async () => {
  //export const handler = async (event, context) => {
  try {
    const pingResult = await auth.ping();
    if (pingResult) {
      console.log("ping result!!!");
      const candidateFields = await getMeta(pingResult);
      //console.log(`candidateFields test`, candidateFields);
      await getData(pingResult, candidateFields);
      //await getData(pingResult);
    }
  } catch (error) {
    console.log(`ping error main`, error);
    try {
      const login = await auth.login();

      if (login) {
        console.log(`login`);
        const candidateFields = await getMeta(login);
        await getData(login, candidateFields);
        //await getData(login);
      }
    } catch (error) {
      console.log(`login error`, error);
    }
  }
};

run();
