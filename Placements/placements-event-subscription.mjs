// Import the AWS SDK and Axios libraries
import AWS from "aws-sdk";
import axios from "axios";

// Configure the AWS SDK with the desired region
AWS.config.update({ region: "us-west-2" });

// Define an asynchronous function to get data from Bullhorn using REST API
export async function getData(BhRestToken, fields) {
  // Define the base REST URL for the Bullhorn API
  const restUrl = "https://rest42.bullhornstaffing.com/rest-services/6rmuc9/";

  // Define the fields to be retrieved
  const fieldsParams = fields;

  /*
  Details for this Event subscription:
{
    "subscriptionId": "newPlacementSubscription",
    "jmsSelector": "JMSType='ENTITY' AND BhCorpId=20229 AND BhEntityName='Placement' AND BhEntityEventType='INSERTED'",
    "lastRequestId": 0,
    "createdOn": 1681455379587
}
  */

  try {
    // Make a GET request to the Bullhorn API to retrieve new placement IDs
    const response = await axios.get(
      `${restUrl}event/subscription/newPlacementSubscription?BhRestToken=${BhRestToken}&maxEvents=100&requestId=1`
    );
    // Extract the requestId and events from the API response
    const requestId = response.data.requestId;
    const resultArray = response.data.events;

    // Map the events to an array of entity IDs
    const newArray = resultArray.map((event) => event.entityId);
    const subIds = newArray.join(",");

    try {
      // Make another GET request to the Bullhorn API to retrieve placement details
      const response2 = await axios.get(
        `${restUrl}entity/Placement/${subIds}?BhRestToken=${BhRestToken}&fields=${fieldsParams}`
      );
      // Extract the placements data from the API response
      const placements = response2.data.data;

      // Check if there are any placements in the response
      if (placements.length > 0) {
        // Iterate through each placement and process the data
        for (const placement of placements) {
          // Create an object to store placement data along with requestId
          let placementData = {
            requestId: requestId,
          };
          // Log the placement data for debugging purposes
          console.log("candidate", placementData);
        }
      }
    } catch (error) {
      // Log any errors while making the second GET request
      console.log(error);
    }
  } catch (error) {
    // Log any errors while making the first GET request
    console.log(error);
  }
}
