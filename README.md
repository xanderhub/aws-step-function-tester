# aws-step-function-tester

This is a Node.js library designed to facilitate testing of **AWS Step Functions**.
It provides utilities and commands to interact with AWS services, allowing developers to simulate
and validate the behavior of their serverless applications.
The library is built using **TypeScript** and includes dependencies for AWS SDK clients.

## The Problem

Testing AWS Step Functions can be challenging due to several reasons:

- **Complexity**: Step Functions can involve multiple states and transitions,
  making it difficult to cover all possible execution paths and edge cases.
  
  ![{CE3A9BDC-D96B-4510-AD5A-67EC5F64235A}](https://github.com/user-attachments/assets/7d861746-0c0a-4ff2-ba33-4ebe8293836a)


- **Error handling**: Properly simulating and testing error scenarios, such as timeouts and service failures, 
requires additional effort to ensure the Step Function behaves as expected.

![{D2AB2327-8B4C-4D51-A27D-4E12E6A975BB}](https://github.com/user-attachments/assets/8321c1bf-527c-42d1-be88-9398971d6da7)


- **Simulation and mocking**: Using the Real AWS Step Functions with Mocks can be challenging
   
  ![{825B06EF-EC44-45F8-BB57-C57C52727232}](https://github.com/user-attachments/assets/fb2f0f8e-fc3e-41c0-aa8a-bb7bb8f5a68b)



## Solution - aws-step-function-tester
The main idea of this library is to create an intuitive API based on AWS-SDK for testing real Step Function running on your AWS account.
Just like _Jest_ or _Chai_ for AWS Step Function but with high fidelity with easy setup and integration with existing E2E tests you have.

![{8CB92A2C-2EEC-4C61-AFD5-D8BA645F3662}](https://github.com/user-attachments/assets/f217503f-9c1d-4f52-b53f-fb8ebe3cb8c8)


## Features

- Copy and manipulate AWS Step Functions for testing purposes
- Create mocks of Lambda functions and integrate them into your copy of Step Function
- Simulate various Lambda execution scenarios (e.g., timeouts, memory overload)
- Mock behavior of other AWS services (e.g., S3, SQS)
- Inspect Step Function execution and status



## How To Use

![{C96FA410-20F5-4289-BA11-0AC25A1BD303}](https://github.com/user-attachments/assets/84767065-08cc-4c35-8fb2-26b30ca6fc3e)

```
const copyStepFunction: SfnInstance = await createCopyStepFunction("original-step-function-ARN");
```
![{13799992-8061-406C-B1C2-AF546321D9D8}](https://github.com/user-attachments/assets/ea7c6aa5-ad1c-46ae-8732-c2caa8ea10c6)

```
const lambdaMock: LambdaMock = await createLambdaMock("original-lambda-name");
```

![{0A56CCE4-BEC9-4881-A6FB-8FCCD0DF4D69}](https://github.com/user-attachments/assets/db256161-7fde-46c7-8856-fc6e6fb5149d)

```
await lambdaMock.memoryOverload();
await lambdaMock.timeout();
await lambdaMock.throttle();
await lambdaMock.custom("path/to/source/code", "handler");
await lambdaMock.reset();

```
![{10F1ADDF-51B1-40FC-9C1C-DEDFD90878DC}](https://github.com/user-attachments/assets/2af2eb16-9262-453c-97d1-0413271e7629)

```
await copyStepFunction.mockLambdaStep("step-name", lambdaMock);
```
![{116A5B5E-ABB1-41B7-9124-FE8AD169CD2D}](https://github.com/user-attachments/assets/2ad2ea8b-02b4-4cfb-8b56-c1d74c952c06)


```
    const execution: SfnExecution = await copyStepFunction.execute();

    await expect(execution).toFail();
    await expect(execution).toExecuteStep("Log Timeout Error");
    await expect(execution).toExecuteStep("Fail");
```


## Limitations

- **Relatively slow**  due to network latency and communication with AWS service.
- **Cost**  for using real Step Functions, Lambda, and other resources.
- **Mocking of AWS services**  is limited, and not all cases can be covered 










