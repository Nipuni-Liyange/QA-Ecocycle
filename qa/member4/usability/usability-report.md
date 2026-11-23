# EcoCycle – Usability Testing Report

**Module:** Software Testing and Quality Assurance  
**Testing Date:** 2026-11-23  
**Application:** EcoCycle  

## 1. Objective

The objective of usability testing was to evaluate the application's responsive layout, readability, navigation, and basic interaction across mobile, tablet, and desktop screen sizes.

## 2. Testing Environment

- Browser: Google Chrome
- Testing tool: Chrome Developer Tools – Device Toolbar
- Testing method: Responsive screen emulation
- Application URL: http://localhost:4000

## 3. Test Results

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

## 4. Summary

Usability testing was performed at three screen sizes: mobile, tablet, and desktop.

All tested layouts and interactions worked as expected. No responsive layout defects were identified during these checks.

## 5. Limitations

- Testing was performed using Chrome responsive device emulation, not physical devices.
- Only the tested pages and interactions are covered by these results.
- Cross-browser compatibility was not evaluated.
- Accessibility testing was not performed.
- Complete end-to-end user workflows were not evaluated.
- The results do not represent a full usability evaluation of every application feature.

## 6. Conclusion

Based on the completed tests, the EcoCycle application demonstrated satisfactory responsive layout and basic navigation behaviour at the three tested screen sizes. No usability defects were confirmed during this testing.