# lib-applink-sfn-tester

This is a Node.js library designed to facilitate testing of **AWS Step Functions**.
It provides utilities and commands to interact with AWS services, allowing developers to simulate
and validate the behavior of their serverless applications.
The library is built using **TypeScript** and includes dependencies for AWS SDK clients.

## The Problem

Testing AWS Step Functions can be challenging due to several reasons:

- Complexity: Step Functions can involve multiple states and transitions,
  making it difficult to cover all possible execution paths and edge cases.

- Integration with AWS Services: Step Functions often interact with various AWS services (e.g., Lambda, S3, SQS),
  requiring a comprehensive setup to simulate these interactions accurately.

- Error Handling: Properly simulating and testing error scenarios, such as timeouts and service failures,
  requires additional effort to ensure the Step Function behaves as expected.  


## Features

- Copy and manipulate AWS Step Functions for testing purposes
- Create mocks of Lambda functions and integrate them into
- Simulate various Lambda execution scenarios (e.g., timeouts, memory overload)
- Mock behavior of other AWS services (e.g., S3, SQS)
- Copy and manipulate AWS Step Functions

