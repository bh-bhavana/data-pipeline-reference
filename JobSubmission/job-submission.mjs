import AWS from "aws-sdk";
import axios from "axios";
//import { addItemToDDB } from "../ddb.mjs";
//import updateBullhorn from "./updateBullhorn.mjs";

AWS.config.update({ region: "us-west-2" });

export async function getData(BhRestToken, fields) {
  const restUrl = "https://rest42.bullhornstaffing.com/rest-services/6rmuc9/";

  //const fieldsParams = fields;
  //console.log(`fields check`, fieldsParams);

  const fieldsParams = fields;

  /*
  Details for this Event subscription:
  {
    "subscriptionId": "newJobSubmissionSubscription",
    "jmsSelector": "JMSType='ENTITY' AND BhCorpId=20229 AND BhEntityName='JobSubmission' AND BhEntityEventType='INSERTED'",
    "lastRequestId": 0,
    "createdOn": 1681454943450
}
  */

  try {
    //GET jobSub IDs from JobSubmission Subscription
    const response = await axios.get(
      `${restUrl}event/subscription/newJobSubmissionSubscription?BhRestToken=${BhRestToken}&maxEvents=500`
      //`${restUrl}event/subscription/newjobSubSubscription?BhRestToken=${BhRestToken}&maxEvents=100&requestId=1` // I use line this for testing
    );
    const requestId = response.data.requestId;
    const resultArray = response.data.events;
    const newArray = resultArray.map((event) => event.entityId);
    const subIds = newArray.join(",");
    //console.log(`subIds`, subIds);

    try {
      const response2 = await axios.get(
        `${restUrl}entity/JobSubmission/${subIds}?BhRestToken=${BhRestToken}&fields=${fieldsParams}`
      );
      const jobSubmissions = response2.data.data;

      if (jobSubmissions.length > 0) {
        //console.log(`jobSubs found, count=`, jobSubs.length);

        for (const jobSub of jobSubmissions) {
          let jobSubData = {
            requestId: requestId,
            ID: jobSub.id,
            Appointments: jobSub.appointments,
            BillRate: jobSub.billRate,
            BranchID: jobSub.branch,
            Clinician: jobSub.jobSub,
            Comments: jobSub.comments,
            LatestAvailableStartDate: jobSub.customDate1,
            COVID19VaccinationDate1: jobSub.customDate2,
            COVID19VaccinationDate2: jobSub.customDate3,
            DOB: jobSub.customDate4,
            COVID19VaccinationBoosterDate: jobSub.customDate5,
            HoursPerWeek: jobSub.customFloat1,
            customFloat2: jobSub.customFloat2,
            customFloat3: jobSub.customFloat3,
            customFloat4: jobSub.customFloat4,
            customFloat5: jobSub.customFloat5,
            customInt1: jobSub.customInt1,
            TravelOrLocal: jobSub.customInt2,
            COVID19VaccinationStatus: jobSub.customInt3,
            PreferredDurationInWeeks: jobSub.customInt4,
            customInt5: jobSub.customInt5,
            CustomText1: jobSub.customText1,
            customText10: jobSub.customText10,
            Address: jobSub.customText11,
            County: jobSub.customText12,
            MatchingJobs: jobSub.customText13,
            FullSSN: jobSub.customText14,
            customText15: jobSub.customText15,
            customText16: jobSub.customText16,
            customText17: jobSub.customText17,
            customText18: jobSub.customText18,
            customText19: jobSub.customText19,
            CustomText2: jobSub.customText2,
            customText20: jobSub.customText20,
            customText21: jobSub.customText21,
            customText22: jobSub.customText22,
            customText23: jobSub.customText23,
            TestField: jobSub.customText24,
            customText25: jobSub.customText25,
            CustomText3: jobSub.customText3,
            CustomText4: jobSub.customText4,
            CustomText5: jobSub.customText5,
            DealSheetID: jobSub.customText6,
            InterviewAvailability: jobSub.customText7,
            PendingLicensesCertifications: jobSub.customText8,
            RequestedTimeOff: jobSub.customText9,
            AdditionalDetailsDealbreakerNotes: jobSub.customTextBlock1,
            customTextBlock2: jobSub.customTextBlock2,
            customTextBlock3: jobSub.customTextBlock3,
            customTextBlock4: jobSub.customTextBlock4,
            customTextBlock5: jobSub.customTextBlock5,
            DateAdded: jobSub.dateAdded,
            DateLastModified: jobSub.dateLastModified,
            DateWebResponse: jobSub.dateWebResponse,
            ExtensionEndDate: jobSub.endDate,
            IsDeleted: jobSub.isDeleted,
            IsHidden: jobSub.isHidden,
            Job: jobSub.jobOrder,
            JobSubmissionCertificationRequirements:
              jobSub.jobSubmissionCertificationRequirements,
            LatestAppointment: jobSub.latestAppointment,
            MigrateGUID: jobSub.migrateGUID,
            Owners: jobSub.owners,
            payRate: jobSub.payRate,
            salary: jobSub.salary,
            AddedBy: jobSub.sendingUser,
            source: jobSub.source,
            EarliestAvailableStartDate: jobSub.startDate,
            SubmissionStatus: jobSub.status,
            Task: jobSub.tasks,
          };
          console.log("jobSub", jobSubData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}
