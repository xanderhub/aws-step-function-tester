# lib-applink-sfn-tester

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

