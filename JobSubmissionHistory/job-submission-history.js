import { upload } from "../libs/upload_to_s3.mjs";
import axios from "axios";
import json2csv from "json2csv";
import dotenv from "dotenv";
dotenv.config();

export default async function intSubs(BhRestToken) {
  const startOfWorkWeek = process.env.STARTOFWORKWEEK;
  const endOfWorkWeek = process.env.ENDOFWORKWEEK;
  const restUrl = process.env.RESTURL;
  const reportName = process.env.INTSUBS;

  const fields =
    "id,dateAdded,jobSubmission(id,jobOrder(id,title,customText8,reportTo,clientCorporation(customText19),owner(name)),candidate(name,owner(name))),modifyingUser(name),status,transactionID";

  const where = `dateAdded>${startOfWorkWeek} AND dateAdded<${endOfWorkWeek} AND status='Internal Submission'`;

  await axios
    .get(
      `${restUrl}query/JobSubmissionHistory?BhRestToken=${BhRestToken}&fields=${fields}&count=500&start=0&where=${where}`
    )
    .then(async (response) => {
      const jstring = JSON.stringify(response.data, undefined, 4);
      //console.log('jstring', jstring);
      const jparse = JSON.parse(jstring);

      let csv = json2csv.parse(jparse.data, {
        fields: [
          "status",
          "dateAdded",
          "jobSubmission.candidate.owner.name",
          "jobSubmission.id",
          "jobSubmission.candidate.id",
          "jobSubmission.candidate.name",
          "jobSubmission.jobOrder.id",
          "jobSubmission.jobOrder.owner.name",
          "jobSubmission.jobOrder.title",
          "jobSubmission.jobOrder.clientCorporation.id",
          "jobSubmission.jobOrder.clientCorporation.name",
          "jobSubmission.jobOrder.clientCorporation.customText19",
          "jobSubmission.jobOrder.customText8",
          "jobSubmission.jobOrder.reportTo",
          "modifyingUser.name",
        ],
      });

      let csv2 = json2csv.parse(jparse.data, {
        fields: [
          { label: "Status", value: "status" },
          { label: "Date Added", value: "dateAdded" },
          {
            label: "Recruiter",
            value: "jobSubmission.candidate.owner.name",
          },
          { label: "Job Submission ID", value: "jobSubmission.id" },
          {
            label: "Candidate ID",
            value: "jobSubmission.candidate.id",
          },
          {
            label: "Candidate Name",
            value: "jobSubmission.candidate.name",
          },
          {
            label: "Job Order ID",
            value: "jobSubmission.jobOrder.id",
          },
          {
            label: "Account Manager",
            value: "jobSubmission.jobOrder.owner.name",
          },
          {
            label: "Job Title",
            value: "jobSubmission.jobOrder.title",
          },
          {
            label: "Client Corporation ID",
            value: "jobSubmission.jobOrder.clientCorporation.id",
          },
          {
            label: "Facility",
            value: "jobSubmission.jobOrder.clientCorporation.name",
          },
          {
            label: "Client Tier",
            value: "jobSubmission.jobOrder.clientCorporation.customText19",
          },
          {
            label: "Hot Job Details",
            value: "jobSubmission.jobOrder.customText8",
          },
          {
            label: "Recruiter",
            value: "jobSubmission.jobOrder.reportTo",
          },
          { label: "Modifying User", value: "modifyingUser.name" },
        ],
      });

      csv = csv.toString();
      //console.log('csv data', csv);

      csv2 = csv2.toString();
      //console.log('csv2 data', csv2);

      await upload(csv, reportName);
      console.log("end of s3 upload block int subs");
    })
    .catch((error) => {
      console.log(`${reportName} API call error`, error);
    });
}
