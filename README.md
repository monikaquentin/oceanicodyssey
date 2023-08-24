# OceanicOdyssey | NodeJS-18.x

This project contains source code and supporting files for a serverless application (a piece from Twin Rose Back-End) that you can deploy with the SAM CLI. It includes the following files and folders.

```
oceanicodyssey
├── bin
│   ├── events
│   ├── functions
│   │   ├── index
│   └── helpers
│       ├── classes
│       ├── infra
│       ├── models
│       ├── node_modules
│       └── utils
└── node_modules
```

-   `events` - Invocation events that you can use to invoke the function.
-   `functions` - The entry point to the logic of the function itself, main functions.
-   `index` - It must contain at least an index (entry point) and a validation file.
-   `helpers` - Helper layer which contains the core and related function services.
-   `classes` - A help class that contains the main logic.
-   `infra` - environment variables.
-   `models` - Database model schema.
-   `utils` - Contains sub-functions that act as helpers, not main functions.
-   `node_modules` - Directory where Node.js stores all packages (libraries or modules).

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

Don't forget to create a new customized `.env.json` file from a copy of the `.env.example.json` file in the directory:

```
oceanicodyssey
├── bin
│   └── helpers
│       ├── .env.example.json
│       ├── .env.json
```

## Requirements

-   [AWS CLI](https://aws.amazon.com/cli) already configured with Administrator permission.
-   [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) installed - minimum `v1.94.0` (sam --version).
-   [NodeJS](https://nodejs.org/en) `>= v18.17.1`, including the NPM package management tool `>= v9.8.1`.
-   [Docker](https://hub.docker.com/search/?type=edition&offering=community) - Community Edition.

## Build and test locally

Build your application with the `build:docker` command.

If you prefer to use the aws `sam build` command you have to manually install the helper layer dependencies in the `bin/helpers` directory with the `npm i` command otherwise the application cannot run on your local machine, below command is suggested to save your time:

```bash
$ npm i && npm run build:docker
```

You can also use `npm run build` only (no docker container).

The SAM CLI installs dependencies defined in `package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `bin/events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
$ sam local invoke IndexLambda --event bin/events/event.json
```

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
$ sam local start-api
$ curl http://127.0.0.1:3000/v0
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
Events:
    Index:
        Type: Api
        Properties:
            Path: /v0
            Method: GET
```

## Application deployment

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To build and deploy your application for the first time, run the following in your shell:

```bash
$ npm run build:docker
$ npm run deploy:guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts:

-   **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name.
-   **AWS Region**: The AWS region you want to deploy your app to.
-   **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
-   **Allow SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `npm run deploy` or `sam deploy` command.
-   **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `npm run deploy` or `sam deploy` without parameters to deploy changes to your application.

You can find your API Gateway Endpoint URL in the output values displayed after deployment.

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs generated by your deployed Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

`NOTE`: This command works for all AWS Lambda functions; not just the ones you deploy using SAM.

```bash
$ sam logs -n IndexLambda --stack-name OceanicOdyssey --tail
```

You can find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
$ npm run delete
```

OR

```bash
$ sam delete --stack-name OceanicOdyssey
```
