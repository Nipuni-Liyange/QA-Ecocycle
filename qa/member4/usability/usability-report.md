# EcoCycle – Usability Testing Report

**Module:** Software Testing and Quality Assurance  
**Testing Date:** 2026-11-23  
**Application:** EcoCycle

## 1. Objective

The objective of usability testing was to evaluate the application's responsive layout, readability, navigation, accessibility, and basic user interactions across mobile, tablet, and desktop screen sizes.

The testing also evaluated important user tasks, including account registration, pickup creation, editing pending requests, and finding pickup tracking information.

## 2. Testing Environment

- Browser: Google Chrome
- Testing tool: Chrome Developer Tools – Device Toolbar
- Testing method: Responsive screen emulation
- Application URL: http://localhost:4000
- Mobile resolution: 360 × 800 pixels
- Tablet resolution: 768 × 1024 pixels
- Desktop resolution: 1366 × 768 pixels

## 3. Responsive Layout Test Results

### UT-01: Mobile View

**Screen resolution:** 360 × 800 pixels

| Test item | Expected result | Actual result | Status |
|---|---|---|---|
| Page layout | Content fits the screen | Layout displayed correctly | PASS |
| Text readability | Text is readable | Text was readable | PASS |
| Form fields | Fields fit within the screen | Fields displayed correctly | PASS |
| Buttons | Buttons are visible and usable | Login button displayed correctly | PASS |
| Navigation menu | Hamburger menu opens correctly | Menu opened successfully | PASS |
| Scrolling | User can access the complete page | Scrolling worked correctly | PASS |
| Horizontal overflow | No unnecessary horizontal scrolling | No visible overflow | PASS |

**Overall result: PASS**

### UT-02: Tablet View

**Screen resolution:** 768 × 1024 pixels

| Test item | Expected result | Actual result | Status |
|---|---|---|---|
| Sidebar navigation | Sidebar is properly displayed | Sidebar displayed correctly | PASS |
| Main content | Content fits the available space | Content displayed correctly | PASS |
| Request card | Pickup request information is visible | Request card displayed correctly | PASS |
| Text readability | Text is readable | Text was readable | PASS |
| Navigation interaction | Sidebar options work | Navigation options worked | PASS |
| Scrolling | Page content can be accessed | Scrolling worked correctly | PASS |

**Overall result: PASS**

### UT-03: Desktop View

**Screen resolution:** 1366 × 768 pixels

| Test item | Expected result | Actual result | Status |
|---|---|---|---|
| Page layout | Content is properly aligned | Layout appeared correctly | PASS |
| Navigation | Navigation elements are visible | Navigation displayed correctly | PASS |
| Images | Images fit the layout | Images appeared correctly | PASS |
| Text readability | Text is readable | Text was readable | PASS |
| Buttons and forms | Elements are properly positioned | Elements appeared correctly | PASS |
| Overlapping elements | No unwanted overlapping | No visible overlapping | PASS |

**Overall result: PASS**

## 4. Usability Task Walkthroughs

The following user tasks were tested using the mobile responsive view at 360 × 800 pixels.

### UT-04: User Registration

**Objective:** Verify that a new user can successfully register an account.

| Test item | Expected result | Actual result | Status |
|---|---|---|---|
| Registration form | Registration fields are displayed | Fields displayed correctly | PASS |
| Required fields | Required fields are indicated | Required fields marked with asterisks | PASS |
| Empty form submission | Submission is prevented | Browser displayed a required-field message | PASS |
| Account registration | User can create an account | Account registered successfully | PASS |
| Dashboard navigation | User is redirected to the dashboard | Dashboard opened successfully | PASS |

**Overall result: PASS**

### UT-05: Create Pickup Request

**Objective:** Verify that a registered user can create a pickup request.

| Test item | Expected result | Actual result | Status |
|---|---|---|---|
| Create request navigation | User can access the pickup form | Form opened successfully | PASS |
| Item information | User can enter item details | Item details entered successfully | PASS |
| Collection details | User can enter collection information | Collection details entered successfully | PASS |
| Form submission | Valid request is accepted | Request submitted successfully | PASS |
| Pickup details | Created request information is displayed | Details displayed correctly | PASS |
| Initial status | New request starts as pending | Pending status displayed | PASS |

**Overall result: PASS**

### UT-06: Edit Pending Pickup Request

**Objective:** Verify that a user can edit an existing pending pickup request.

| Test item | Expected result | Actual result | Status |
|---|---|---|---|
| Edit option | User can access the edit function | Edit request option was available | PASS |
| Existing information | Previous information is populated | Existing details displayed correctly | PASS |
| Update description | User can modify the description | Description updated successfully | PASS |
| Save changes | Updated information is saved | Success message displayed | PASS |
| Request status | Request remains pending | Pending status remained unchanged | PASS |

**Overall result: PASS**

### UT-07: Find Pickup Tracking Status

**Objective:** Verify that users can find and understand their pickup progress.

| Test item | Expected result | Actual result | Status |
|---|---|---|---|
| Tracking page | User can access pickup tracking | Tracking page opened successfully | PASS |
| Active pickup | Created pickup is displayed | Pickup appeared in active pickups | PASS |
| Current status | Current pickup status is visible | Pending status displayed | PASS |
| Progress indicator | Pickup stages are understandable | Five-stage progress indicator displayed | PASS |
| Activity timeline | Pickup activity is displayed | Activity timeline displayed correctly | PASS |

The application displayed the following pickup stages:

Pending → Accepted → Scheduled → Collected → Recycled

**Overall result: PASS**

## 5. Accessibility and Form Interaction Testing

### UT-08: Keyboard Navigation

**Objective:** Verify that users can navigate form elements using the keyboard.

| Test item | Expected result | Actual result | Status |
|---|---|---|---|
| Tab navigation | Focus moves through interactive elements | Tab navigation worked correctly | PASS |
| Focus visibility | Current focused element is identifiable | Focus indication was visible | PASS |

**Overall result: PASS**

### UT-09: Required-Field Validation

**Objective:** Verify that the pickup form prevents submission when required information is missing.

| Test item | Expected result | Actual result | Status |
|---|---|---|---|
| Empty form submission | Incomplete form is rejected | Submission was prevented | PASS |
| Field identification | Missing required field is identified | Focus moved automatically to the Item Category field | PASS |
| User guidance | User can identify where to correct the form | Required field was brought into focus | PASS |

**Overall result: PASS**

### UT-10: Reduced Motion Preference

**Objective:** Verify that the application responds to the browser's reduced-motion preference.

| Test item | Expected result | Actual result | Status |
|---|---|---|---|
| Reduced-motion setting | Application reduces animations when requested | Animations were disabled when reduced motion was enabled | PASS |

**Overall result: PASS**

## 6. Overall Test Summary

| Category | Tests performed | Result |
|---|---:|---|
| Responsive layout | 3 | All passed |
| User task walkthroughs | 4 | All passed |
| Accessibility and form interaction | 3 | All passed |
| **Total** | **10** | **All passed** |

No confirmed usability defects were identified during the completed tests.

## 7. Limitations

- Testing was performed using Google Chrome responsive device emulation, not physical devices.
- Only the tested pages and user interactions are covered by these results.
- Cross-browser compatibility was not evaluated.
- Full accessibility compliance was not evaluated.
- Complete application workflows beyond the listed tasks were not tested.
- Reduced-motion testing was limited to checking whether animations were disabled.
- The results do not represent a full usability evaluation of every application feature.
- No separate usability screenshot set is present in the current QA folder; the test outcomes are recorded in this report.

## 8. Conclusion

Usability testing was performed on the EcoCycle application across mobile, tablet, and desktop screen sizes.

The application successfully supported the tested user tasks, including account registration, pickup request creation, editing pending requests, and viewing pickup tracking information.

Keyboard navigation, required-field validation, and reduced-motion behaviour were also checked.

All ten documented test cases passed. No confirmed usability defects were identified during the completed testing activities.