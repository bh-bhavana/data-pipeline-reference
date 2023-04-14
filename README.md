##Entities:

- [Candidate](./Candidate/candidate-event-subscription.mjs)
- [CandidateHistory](./CandidateHistory/candidate-history.js)
- [JobOrder](./JobOrder/job-order-event.js)
- [JobSubmission](./JobSubmission/job-submission.mjs)
- [JobSubmissionHistory](./JobSubmissionHistory/job-submission-history.js)
- [Placements](./Placements/placements-event-subscription.mjs)

Bullhorn API Reference: https://bullhorn.github.io/rest-api-docs/index.html
Bullhorn Entity Reference: https://bullhorn.github.io/rest-api-docs/entityref.html
Bullhorn Typescript Interfaces: https://github.com/bullhorn/bullhorn-types/blob/master/src/index.ts

###Report Examples:

Our main reporting Dashboard, Recruiter Activity Report: https://docs.google.com/spreadsheets/d/1zt8WWKBkg7DUorbbKOnzskQg5DBHxdP4Pv87TzgY05E/edit?usp=sharing

This is the Lambda function that generates most of the data on this report: arn:aws:lambda:us-west-2:871488337293:function:recruiter_activity

All of the API responses are converted to csv and added to an S3 bucket named 'tom-test-4'

###Examples:

- [CandidateHistory csv in S3](https://tom-test-4.s3.us-west-2.amazonaws.com/MPC.csv)
- [JobSubmissionHistory csv in S3](https://tom-test-4.s3.us-west-2.amazonaws.com/InternalSubmissions.csv)

##Glue Jobs for Recruiter Activity Report

###Weekly

- TempCurrentCOAjob - https://us-west-2.console.aws.amazon.com/databrew/home?region=us-west-2#job-details?job=TempCurrentCOAjob&tab=history
- TempCARminusCOA - https://us-west-2.console.aws.amazon.com/databrew/home?region=us-west-2#job-details?job=TempCARminusCOA&tab=history
- RecruiterActivityReports - https://us-west-2.console.aws.amazon.com/databrew/home?region=us-west-2#job-details?job=RecruiterActivityReports&tab=history
- TempFinalRecruiterReport - https://us-west-2.console.aws.amazon.com/databrew/home?region=us-west-2#job-details?job=TempFinalRecruiterReport&tab=history

###Monthly

- MonthlyRecruiterActivityReport - https://us-west-2.console.aws.amazon.com/databrew/home?region=us-west-2#job-details?job=MonthlyRecruiterActivityReport&tab=history
- MonthlyTOAReport - https://us-west-2.console.aws.amazon.com/databrew/home?region=us-west-2#job-details?job=MonthlyTOAReport&tab=history
- MonthlyCandActReport - https://us-west-2.console.aws.amazon.com/databrew/home?region=us-west-2#job-details?job=MonthlyCandActReport&tab=history
- MonthlyCommissionSalesReport - https://us-west-2.console.aws.amazon.com/databrew/home?region=us-west-2#job-details?job=MonthlyCommissionSalesReport&tab=history

---

##JobOrder event subscription

- [JobOrder in DynamoDB](https://us-west-2.console.aws.amazon.com/dynamodbv2/home?region=us-west-2#table?name=all-job-orders)
  --Adds all new JobOrders as items to a DynamoDB table

The above table is used to create XML feeds for external job boards

Example XML Feed Lambda function: arn:aws:lambda:us-west-2:871488337293:function:BluePipes-XML-feed
XML Output on S3: https://bluepipes-xml-feed.s3.us-west-2.amazonaws.com/bluepipes-job-listings.xml

---

#[BHAuth Class](./BHAuth.mjs) (Bullhorn OAuth2.0)

Bullhorn OAuth2.0 guide: https://bullhorn.github.io/Getting-Started-with-REST/

###Process:

1. Check the token's validity: Use the ping() method to determine if the last known token, stored in DynamoDB, is still valid. Tokens expire every 30 minutes.

2. Log in when necessary: If the token is not valid, attempt to log in by requesting a new Auth Code. Currently, the implementation does not use a refresh token to maintain the session.

###Methods:

- **getAuthCode**: This method fetches an authorization code from the Bullhorn API. It uses Axios to send a GET request with the required parameters like client_id, username, and password. If the request is successful, the method extracts the authorization code from the response and returns it.

- **getTokens**: This method takes the authorization code as an input and sends a POST request to the Bullhorn API to get the access token. It passes the required parameters like client_secret and grant_type in the request. If the request is successful, it returns the access token.

- **login**: This method first calls getAuthCode to get the authorization code, then it calls getTokens to get the access token. With the access token, it sends a POST request to log in to the Bullhorn API. If the login is successful, it gets the BhRestToken from the response, updates the database with this token using updateBhRestToken, and returns the BhRestToken.

- **ping**: This method checks the status of the current session with the Bullhorn API. It first gets the BhRestToken from the database, then sends a GET request to the Bullhorn API with the BhRestToken. If the session is still active, it calculates the time remaining before the session expires and logs it to the console. If there's an error, it logs the error message to the console.

---

#[DDB Module](./ddb.mjs)

This module provides utility functions to update and retrieve Bullhorn API tokens stored in an AWS DynamoDB table.

###Functions
**updateTokens(a, c)**: This function updates the access and refresh tokens in the DynamoDB table. It takes two parameters:

- a (string): Access token
- c (string): Refresh token

The function also updates the last_update field with the current timestamp. If the update is successful, it logs a success message; otherwise, it logs the error.

**updateBhRestToken(b)**: This function updates the BhRestToken in the DynamoDB table.
It takes one parameter: b (string): BhRestToken

The function sends an update request to the DynamoDB table. If the update is successful, it logs a success message; otherwise, it logs the error.

**getBhRestToken()**: This function retrieves the BhRestToken from the DynamoDB table. It takes no parameters.

The function sends a read request to the DynamoDB table. If the read is successful, it logs the BhRestToken and returns it; otherwise, it logs the error.

###Usage
Import the module:

import { updateTokens, updateBhRestToken, getBhRestToken } from './path/to/module';
To update the access and refresh tokens, call the updateTokens function:

await updateTokens(access_token, refresh_token);
To update the BhRestToken, call the updateBhRestToken function:

await updateBhRestToken(BhRestToken);
To get the BhRestToken, call the getBhRestToken function:

const BhRestToken = getBhRestToken();
Please note that the getBhRestToken function is synchronous and doesn't return a Promise. To use the returned BhRestToken, you may need to wrap the function in a Promise or use other asynchronous techniques.
