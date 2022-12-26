declare const Parse: any;

Parse.Cloud.define('Hello', () => {
  return `Hello! Cloud functions are cool!`;
});

Parse.Cloud.define('SayMyName', (request: any) => {
  return `Hello ${request.params.name}! Cloud functions are cool!`;
});

Parse.Cloud.define('getUser', async (request: any) => {
  const query = new Parse.Query("_User");
  query.equalTo("ethAddress", request.params.address);
  const results = await query.find({ useMasterKey: true });
  return results
});
