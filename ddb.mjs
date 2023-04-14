import AWS from "aws-sdk";

AWS.config.update({ region: "us-west-2" });
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

export async function updateTokens(a, c) {
  try {
    const timeStampNumber = Date.now();
    console.log("type", typeof timeStampNumber);
    const timeStamp = timeStampNumber.toString();

    const params = {
      TableName: "BH-Tokens",
      Key: {
        Tokens: {
          S: "Recruitment-Reports",
        },
      },
      UpdateExpression: "SET #AT = :x, #RT = :y, #LU = :t",
      ExpressionAttributeNames: {
        "#AT": "access_token",
        "#RT": "refresh_token",
        "#LU": "last_update",
      },
      ExpressionAttributeValues: {
        ":x": {
          S: a,
        },
        ":y": {
          S: c,
        },
        ":t": {
          N: timeStamp,
        },
      },
    };
    const result = await ddb.updateItem(params).promise();
    console.log("access_token success", result);
  } catch (error) {
    console.log("access_token error", error);
  }
}

export async function updateBhRestToken(b) {
  const params3 = {
    TableName: "BH-Tokens",
    Key: {
      Tokens: {
        S: "Recruitment-Reports",
      },
    },
    UpdateExpression: "SET #BT = :z",
    ExpressionAttributeNames: {
      "#BT": "BhRestToken",
    },
    ExpressionAttributeValues: {
      ":z": {
        S: b,
      },
    },
  };

  await ddb.updateItem(params3, function (err, data) {
    if (err) console.log("BhRestToken error", err);
    else console.log("Good", data);
  });
}

export function getBhRestToken() {
  var params = {
    TableName: "BH-Tokens",
    Key: {
      Tokens: { S: "Recruitment-Reports" },
    },
    AttributesToGet: ["BhRestToken"],
  };

  // Call DynamoDB to read the item from the table
  ddb.getItem(params, function (err, data) {
    if (err) {
      console.log("Get token error", err);
    } else {
      console.log("BhRestToken ddb", data.Item.BhRestToken.S);
      return data.Item.BhRestToken.S;
    }
  });
}
