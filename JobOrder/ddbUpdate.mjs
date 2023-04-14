import AWS from "aws-sdk";

AWS.config.update({ region: "us-west-2" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function addItemToDDB(d) {
  const item = {
    id: d.jobID,
    dateAdded: d.dateAdded,
    facility: d.facility,
    hotJob: d.hotJob,
    clientTier: d.clientTier,
    vms: d.vms,
    discipline: d.discipline,
    specialty: d.specialty,
    title: d.title,
    isOpen: d.isOpen,
    publicDescription: d.publicDescription,
    numOpenings: d.numOpenings,
    status: d.status,
    shift: d.shift,
    hrsPerWeek: d.hrsPerWeek,
    shiftsPerWeek: d.shiftsPerWeek,
    grossWeekly: d.grossWeekly,
    lodgingWeekly: d.lodgingWeekly,
    mealsWeekly: d.mealsWeekly,
    startDate: d.startDate,
    durationWeeks: d.durationWeeks,
    certRequirements: d.certRequirements,
    billrate: d.billrate,
    blendedBillRate: d.blendedBillRate,
    city: d.city,
    state: d.state,
    postedVivian: d.postedVivian,
    payRate: d.payRate,
    requestId: d.requestId,
  };

  console.log("ddbUpdate.addItemToDDB() item", item);

  const params = {
    TableName: "all-job-orders",
    Item: item,
  };

  try {
    await dynamoDB.put(params).promise();
    //console.log('Item added to DynamoDB table  1');
  } catch (err) {
    console.log("Error adding item to DynamoDB table: ", err);
  }
}
