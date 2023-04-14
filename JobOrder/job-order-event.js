import AWS from "aws-sdk";
import axios from "axios";
import { addItemToDDB } from "./ddbUpdate.mjs";
//import updateBullhorn from "./updateBullhorn.mjs";

AWS.config.update({ region: "us-west-2" });

export async function getData(BhRestToken) {
  const restUrl = "https://rest42.bullhornstaffing.com/rest-services/6rmuc9/";
  //// the Bullhorn event subscription below is only setup for INSERTED jobs////

  // {
  //     "subscriptionId": "newJobOrderSubscription",
  //     "jmsSelector": "JMSType='ENTITY' AND BhCorpId=20229 AND BhEntityName='JobOrder' AND BhEntityEventType='INSERTED'",
  //     "lastRequestId": 0,
  //     "createdOn": 1674664204894
  // }

  try {
    //GET Job Order IDs from Job Order Subscription
    const response = await axios.get(
      //`${restUrl}event/subscription/newJobOrderSubscription?BhRestToken=${BhRestToken}&maxEvents=500`
      `${restUrl}event/subscription/newJobOrderSubscription?BhRestToken=${BhRestToken}&maxEvents=100&requestId=1421` // I use line this for testing
    );
    const requestId = response.data.requestId;
    const resultArray = response.data.events;
    const newArray = resultArray.map((event) => event.entityId);
    const subIds = newArray.join(",");
    //console.log(`subIds`, subIds);

    fields = ""; //need to add fields here

    try {
      const response2 = await axios.get(
        `${restUrl}entity/JobOrder/${subIds}?BhRestToken=${BhRestToken}&fields=${fields}`
      );
      const jobOrders = response2.data.data;

      if (jobOrders.length > 0) {
        console.log(`Job orders found, count=`, jobOrders.length);

        for (const jobOrder of jobOrders) {
          let jobOrderData = {
            requestId: requestId,
            jobID: jobOrder.id,
            dateAdded: jobOrder.dateAdded,
            facility: jobOrder.clientCorporation,
            city: jobOrder.clientCorporation.address.city,
            state: jobOrder.clientCorporation.address.state,
            payRate: jobOrder.correlatedCustomFloat1,
            lodging: jobOrder.correlatedCustomFloat2,
            meals: jobOrder.correlatedCustomFloat3,
            hotJob: jobOrder.customText8,
            clientTier: jobOrder.customText9,
            vms: jobOrder.customText6,
            discipline: jobOrder.categories,
            specialty: jobOrder.customText5,
            title: jobOrder.title,
            isOpen: jobOrder.isOpen,
            publicDescription: jobOrder.publicDescription,
            numOpenings: jobOrder.numOpenings,
            status: jobOrder.status,
            shift: jobOrder.customText2,
            hrsPerWeek: jobOrder.correlatedCustomText10,
            shiftsPerWeek: jobOrder.customInt4,
            grossWeekly: jobOrder.salary,
            lodgingWeekly: jobOrder.customText10,
            mealsWeekly: jobOrder.customText11,
            startDate: jobOrder.startDate,
            durationWeeks: jobOrder.durationWeeks,
            certRequirements: jobOrder.certifications,
            billrate: jobOrder.correlatedCustomText1,
            blendedBillRate: jobOrder.customText14,
            city: jobOrder.address.city,
            state: jobOrder.address.state,
            postedVivian: jobOrder.customInt1,
          };

          //console.log(`jobOrderData`, jobOrderData);
          await addItemToDDB(jobOrderData);
          //await updateBullhorn(jobOrderData, BhRestToken);
        }
      }
    } catch (error) {
      console.log(`Second API call error`, error);
    }
  } catch (error) {
    console.log("No results, second catch");
  }
}
