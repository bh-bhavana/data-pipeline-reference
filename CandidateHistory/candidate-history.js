import { upload } from "../libs/upload_to_s3.mjs";
import axios from "axios";
import { parse as json2csvParse } from "json2csv";
import dotenv from "dotenv";

dotenv.config();

const startOfWorkWeek = process.env.STARTOFWORKWEEK;
const endOfWorkWeek = process.env.ENDOFWORKWEEK;
const restUrl = process.env.RESTURL;
const reportName = process.env.MPC;

export default async function mpc(BhRestToken) {
  const fields =
    "id,status,dateAdded,modifyingUser,candidate(name,owner(name))";

  const where = `{"where": "(status='MPC') AND modifyingUser<>55220 AND dateAdded>${startOfWorkWeek} AND dateAdded<${endOfWorkWeek}"}`;

  try {
    const response = await axios.post(
      `${restUrl}query/CandidateHistory?BhRestToken=${BhRestToken}&fields=${fields}&count=500&start=0`,
      where
    );

    const jparse = response.data;

    const csv = json2csvParse(jparse.data, {
      fields: [
        "status",
        "dateAdded",
        "candidate.owner.name",
        "candidate.name",
        "candidate.submissions",
      ],
    });

    await upload(csv, reportName);
    console.log("end of s3 upload block mpc");
  } catch (error) {
    console.log(`${reportName} API call error`, error);
  }
}
