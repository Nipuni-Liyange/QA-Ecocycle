Feature: E-waste pickup management
  As an EcoCycle QA tester
  I want to verify authentication, validation and pickup lifecycle through the browser
  So that users and collectors can trust the main workflow

  @M3-BDD01
  Scenario: General User logs in with valid credentials
    Given a newly registered General User is signed out
    When the user signs in with valid credentials
    Then the General User dashboard is shown

  @M3-BDD02
  Scenario: Invalid login is rejected
    Given an unauthenticated visitor opens the login page
    When the visitor submits invalid credentials
    Then the login form shows an authentication error

  @M3-BDD03
  Scenario: General User creates a valid pickup
    Given a newly registered General User is signed in
    When the user submits a valid pickup request
    Then the pickup is displayed with status "pending" after refresh

  @M3-BDD04
  Scenario: Pickup without an item name is rejected
    Given a newly registered General User is on the pickup form
    When the user submits a pickup without an item name
    Then the request is blocked by required-field validation

  @M3-BDD05
  Scenario: Recycling Collector accepts an available pickup
    Given a pending pickup exists from a newly registered General User
    And a newly registered Recycling Collector is signed in
    When the collector accepts that pickup
    Then the pickup is displayed with status "accepted"

  @M3-BDD06
  Scenario: Accepted pickup status persists after refresh
    Given a pending pickup exists from a newly registered General User
    And a newly registered Recycling Collector is signed in
    When the collector accepts that pickup
    Then the pickup is displayed with status "accepted" after refresh

  @M3-BDD07
  Scenario: General User cannot access collector dashboard
    Given a newly registered General User is signed in
    When the General User opens the collector dashboard
    Then the General User remains in the user dashboard

  @M3-BDD08
  Scenario: Logged-out user cannot open protected dashboard
    Given a newly registered General User is signed in
    When the General User logs out and opens the dashboard
    Then the visitor is redirected to the login page
