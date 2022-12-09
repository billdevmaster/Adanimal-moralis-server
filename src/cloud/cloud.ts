declare const Parse: any;

Parse.Cloud.define('Hello', () => {
  return `Hello! Cloud functions are cool!`;
});

Parse.Cloud.define('SayMyName', (request: any) => {
  return `Hello ${request.params.name}! Cloud functions are cool!`;
});