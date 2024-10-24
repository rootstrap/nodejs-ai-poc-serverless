<!--
title: 'AWS NodeJS Example'
description: 'This template demonstrates how to deploy a simple NodeJS function running on AWS Lambda using the Serverless Framework.'
layout: Doc
framework: v4
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, Inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# Getting started

To get started you first have to install the needed dependencies with

```
npm install
```

Then, create a .env file at the root of the project and fill the variables.

After that, add your Vertex AI credentials.json file to the root of the project and/or configure the needed OpenAI variables in the .env file

# Serverless Framework AWS NodeJS Example

This template demonstrates how to deploy a simple NodeJS function running on AWS Lambda using the Serverless Framework. The deployed function does not include any event definitions or any kind of persistence (database). For more advanced configurations check out the [examples repo](https://github.com/serverless/examples/) which include use cases like API endpoints, workers triggered by SQS, persistence with DynamoDB, and scheduled tasks. For details about configuration of specific events, please refer to our [documentation](https://www.serverless.com/framework/docs/providers/aws/events/).

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
serverless deploy
```

After running deploy, you should see output similar to:

```
Deploying "aws-node" to stage "dev" (us-east-1)

✔ Service deployed to stack aws-node-dev (90s)

functions:
  hello: aws-node-dev-hello (1.5 kB)
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```
serverless invoke --function hello
```
### Local development with serverless-offline plugin

```
serverless offline start
```

This will start a local emulator of AWS Lambda and tunnel

Now you can hit the exposed endpoint through postman:

Try hitting 

```
http://localhost:3000/dev
```

You can include **action** query parameter to tell the AI which prompt to use for the given file, if action is not present in the query parameters, the default action will be triggered (analyze)

Heres a cURL you can copy.

```
curl --location 'http://localhost:3000/dev?action=song' \
--form 'file=@"path/to/file"'
```