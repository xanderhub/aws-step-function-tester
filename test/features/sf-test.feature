Feature: POC for SF test using AWS SDK

  Background: Reset step function mocks
    Given Lambda mock is reset


  Scenario: Step function and relevant mocks prepared for testing
    Given Step function dev-rec-innovation-state-machine copied as new step function
    And Lambda mock created as a copy of dev-rec-innovation-lambda lambda
    And Step "Run Innovation Lambda" replaced with mocked lambda


# SF express type scenario
#  Scenario: Step function and relevant mocks prepared for testing
#    Given Step function dev-rec-state-machine-ticket-metadata-enrichment copied as new step function


  Scenario: Memory Overload
    When lambda mock is set to simulate memory overload
    Then Step function fails after "Send Server Error Message" step


  Scenario: Timeout
    When lambda mock is set to simulate timeout
    Then Step function fails after "Log Timeout Error" step


  Scenario: Throttle
    When lambda mock is set to simulate throttling
    Then Step function fails after "Send Server Error Message" step


  Scenario: Generic error
    When lambda mock is set to simulate generic error
    Then Step function fails after "Send Server Error Message" step


  Scenario: S3 failure
    When S3 mock is set to simulate failure
    Then Step function fails after "Log S3 error" step
    And Step function restored to original state


  Scenario: Success flow
    Given Step function finishes successfully


  Scenario: Reset step function
    Given Step function restored to original state


  Scenario: Delete copy step function - After All
    Given Step function copy deleted

