import axios from 'axios';
import AWS from 'aws-sdk';
import { config } from 'dotenv';
//import tokenX from './ddb.mjs';
import { updateBhRestToken } from './ddb.mjs';

config();

AWS.config.update({ region: 'us-west-2' });
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

//const app = express();

export default class BHAuth {
    authCode = '';
    // constructor() {
    //     this.authCode = this.getAuthCode();
    // }
    getAuthCode = async () => {
        var BHlogin = process.env.BHLOGIN;
        var BHpw = process.env.BHPW;
        var clientID = process.env.CLIENTID;
        //console.log(`BHlogin`, BHlogin);
        //console.log(`NHpw`, BHpw);
        //console.log(`clientID`, clientID);

        const authCodeURL = `https://auth.bullhornstaffing.com/oauth/authorize`;
        //console.log(`authCodeURL`, authCodeURL);

        const bullhornAPI = axios.create({
            headers: {
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                Accept_Encoding: 'gzip, deflate, br',
            },
            baseURL: authCodeURL,
        });

        let authCode = '';

        await bullhornAPI
            .get(authCodeURL, {
                params: {
                    client_id: clientID,
                    response_type: 'code',
                    action: 'Login',
                    username: BHlogin,
                    password: BHpw,
                    redirect_uri: null,
                },
            })
            .then(async function (response) {
                console.log(`response console log`);
                let authCodeLong = await response.request.path;
                authCode = await authCodeLong.slice(1);
                console.log(`authCode`);
            })
            .catch((error) => {
                console.log(`error`, error);
            });

        return authCode;
    };
    getTokens = async function (authCode) {
        const clientSecret = process.env.CLIENTSECRET;
        const url = `https://auth.bullhornstaffing.com/oauth/token${authCode}&client_secret=${clientSecret}`;
        //console.log(`getTokens url`, url);
        const data = {
            grant_type: 'authorization_code',
        };

        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: '*/*',
                'Cache-Control': 'no-cache',
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
            },
        };

        let aToken = '';

        await axios
            .post(url, data, options)
            .then((response) => {
                // console.log(
                //     `access token response`,
                //     response.data.access_token
                // );
                // console.log(
                //     `refresh token response`,
                //     response.data.refresh_token
                // );

                aToken = response.data.access_token;
            })
            .catch((err) => {
                console.log(`errrrror`, err);
            });

        return aToken;
    };
    login = async () => {
        const authCode = await this.getAuthCode();
        const activeToken = await this.getTokens(authCode);
        // console.log('authCode from login', authCode);
        // console.log(`activeToken from login`, activeToken);

        let BhRestToken = '';

        await axios
            .post(
                `https://rest.bullhornstaffing.com/rest-services/login?version=2.0&access_token=${activeToken}`
            )
            .then(async function (response) {
                //console.log(`response2 - Logged In!!!`, response);
                // console.log(
                //     `BhRestToken from token`,
                //     response.data.BhRestToken
                // );
                //console.log(`refreshToken`, response.data.refreshToken);
                BhRestToken = response.data.BhRestToken;
                await updateBhRestToken(BhRestToken);
                //exports.handler = (event, context, callback) => {
            })
            .catch((error) => {
                console.log(`error2`, error);
                // handle any errors
            });
        return BhRestToken;
    };

    ping = async () => {
        var params = {
            TableName: 'BH-Tokens',
            Key: {
                Tokens: { S: 'Recruitment-Reports' },
            },
            AttributesToGet: ['BhRestToken'],
        };

        return new Promise((resolve, reject) => {
            ddb.getItem(params, function (err, data) {
                if (err) {
                    console.log('Get token error', err);
                } else {
                    const BhRestToken = data.Item.BhRestToken.S;
                    var restUrl = process.env.RESTURL;
                    //console.log('get BhRestToke', BhRestToken);
                    //var response = {};

                    axios
                        .get(`${restUrl}ping?&BhRestToken=${BhRestToken}`)
                        .then((response) => {
                            //console.log(`full ping response`, response);
                            // console.log(
                            //     `ping response`,
                            //     response.data['sessionExpires']
                            // );
                            resolve(BhRestToken);
                            //console.log(`resolve bhrestToken`, BhRestToken);
                            const sessionExp = response.data['sessionExpires'];
                            const date = new Date(sessionExp);
                            const formattedDate = date
                                .toISOString()
                                .slice(0, 19)
                                .replace('T', ' ');

                            const currentTime = new Date();
                            const timeDifference = date - currentTime;
                            const timeDifferenceInMinutes = Math.floor(
                                timeDifference / 1000 / 60
                            );

                            console.log(
                                '\x1b[33m%s\x1b[0m',
                                `Session Expires in ${timeDifferenceInMinutes} minutes`
                            );
                        })
                        .catch((error) => {
                            console.log(`ping error ping`);
                            reject(error);
                        });
                }
            });
        });
    };
}
//module.exports = BHAuth;

//getAuthCode();

//app.use(express.static(path.join(__dirname, 'public')));

//const PORT = process.env.PORT || 5000;

//app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
