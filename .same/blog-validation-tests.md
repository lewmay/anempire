# Blog Routing Fix - Validation Test Checklist

**Version:** 86
**Test Date:** _______________
**Tester:** _______________

---

## PREPARATION

Before starting tests, ensure:
- [ ] Dev server is running (`bun run dev`)
- [ ] Browser console is open (to check for errors)
- [ ] localStorage is cleared (to test access flag behavior)

---

## TEST SUITE

### ✅ Test 1: Visit Pattern Explained → Blog Access Granted

**Steps:**
1. Clear localStorage in browser dev tools
2. Navigate to homepage `/`
3. Scroll down and click "Follow the pattern"
4. Read the Pattern Explained page
5. Scroll to the bottom
6. Check lower-right corner of screen

**Expected Results:**
- [ ] "Blog articles" link appears in lower-right corner
- [ ] Link is styled as quiet footer element (small, light text)
- [ ] Link is clickable

**Pass/Fail:** _______________

---

### ✅ Test 2: Click Blog Articles → Renders Index

**Steps:**
1. From Pattern Explained page, click "Blog articles" link
2. Verify URL changes to `/articles`
3. Check page content

**Expected Results:**
- [ ] Page loads without white screen
- [ ] Page loads without crash
- [ ] URL is `/articles` (not `/blog`)
- [ ] Page title is "Articles"
- [ ] 5 articles are listed:
  1. Marketing Doesn't Fail Loudly
  2. The Bridge Was Never Built
  3. Effort Has a Ceiling
  4. Growth Reveals What Was Invisible
  5. Systems Emerge Because Progress Demands Consistency
- [ ] Each article shows: title, subtitle, optional year
- [ ] Page uses Global Setting 2 (warm paper tone, document panel)
- [ ] "Back to The Pattern" link is visible
- [ ] "Step back" link is visible
- [ ] No console errors

**Pass/Fail:** _______________

---

### ✅ Test 3: Click Article → Renders Article Page

**Steps:**
1. From articles index, click "Marketing Doesn't Fail Loudly"
2. Verify URL changes to `/articles/marketing-doesnt-fail-loudly`
3. Check page content

**Expected Results:**
- [ ] Article page loads without white screen
- [ ] Article page loads without crash
- [ ] URL is `/articles/marketing-doesnt-fail-loudly`
- [ ] Article header displays:
  - [ ] Title: "Most marketing doesn't fail loudly. It fades."
  - [ ] Subtitle
  - [ ] Year (if present)
- [ ] Article body renders (multiple paragraphs)
- [ ] Page uses Global Setting 2 (warm paper tone, document panel)
- [ ] "Other articles" section shows remaining 4 articles
- [ ] "Back to Articles" link is visible
- [ ] "Home" link is visible
- [ ] No console errors

**Pass/Fail:** _______________

---

### ✅ Test 4: Click Back to Articles → Returns to Index

**Steps:**
1. From article page, click "Back to Articles"
2. Verify navigation

**Expected Results:**
- [ ] Returns to `/articles` index page
- [ ] Article list is still visible
- [ ] No crash or white screen
- [ ] No console errors

**Pass/Fail:** _______________

---

### ✅ Test 5: Click Home → Returns to Homepage (No Freeze)

**Steps:**
1. From article page, click "Home"
2. Verify navigation
3. Wait 5 seconds
4. Try scrolling

**Expected Results:**
- [ ] Returns to `/` (homepage)
- [ ] Homepage renders normally
- [ ] Homepage is NOT blank
- [ ] Homepage is NOT frozen
- [ ] Can scroll up/down
- [ ] Fade animations work
- [ ] "Scroll down" prompt appears
- [ ] No redirect loop
- [ ] No console errors

**Pass/Fail:** _______________

---

### ✅ Test 6: Direct Visit /articles Without Flag → Redirects

**Steps:**
1. Clear localStorage in browser dev tools
2. Navigate directly to `/articles` by typing in URL bar
3. Press Enter
4. Observe behavior

**Expected Results:**
- [ ] Redirects to `/` (homepage)
- [ ] Does NOT show white page
- [ ] Does NOT crash
- [ ] Does NOT create redirect loop
- [ ] Homepage loads normally
- [ ] "Blog articles" link does NOT appear (no flag)
- [ ] No console errors

**Pass/Fail:** _______________

---

### ✅ Test 7: Direct Visit /articles/[slug] Without Flag → Redirects

**Steps:**
1. Clear localStorage in browser dev tools
2. Navigate directly to `/articles/marketing-doesnt-fail-loudly`
3. Press Enter
4. Observe behavior

**Expected Results:**
- [ ] Redirects to `/` (homepage)
- [ ] Does NOT show white page
- [ ] Does NOT crash
- [ ] Does NOT create redirect loop
- [ ] Homepage loads normally
- [ ] No console errors

**Pass/Fail:** _______________

---

### ✅ Test 8: Home Page Never Redirects or Freezes

**Steps:**
1. Clear localStorage
2. Navigate to `/`
3. Scroll entire page
4. Click "Follow the pattern"
5. Go back to home
6. Repeat 3 times

**Expected Results:**
- [ ] Home page NEVER redirects to blog
- [ ] Home page NEVER freezes
- [ ] Scrolling works smoothly every time
- [ ] Fade animations work every time
- [ ] No console errors
- [ ] No redirect loops

**Pass/Fail:** _______________

---

### ✅ Test 9: Blog Access Flag Persists Across Sessions

**Steps:**
1. Clear localStorage
2. Visit `/locate/patterns` to set flag
3. Verify "Blog articles" link appears
4. Close browser tab
5. Open new tab and navigate to homepage
6. Check lower-right corner

**Expected Results:**
- [ ] "Blog articles" link still appears
- [ ] Can navigate to `/articles` without redirect
- [ ] Flag persists for 30 days (check expiry in localStorage)

**Pass/Fail:** _______________

---

### ✅ Test 10: Multiple Trigger Points Set Flag

**Steps:**
1. Clear localStorage
2. Test each trigger:
   - [ ] Visit `/locate/patterns` → flag set
   - [ ] Submit question on `/ask` → flag set
   - [ ] Submit conversation request on `/conversation` → flag set
   - [ ] Submit save-for-later on `/locate/save` → flag set

**Expected Results:**
- [ ] Each action sets blog access flag
- [ ] "Blog articles" link appears after each action
- [ ] Flag has 30-day expiry
- [ ] Flag name: `anempire_engaged`
- [ ] Expiry name: `anempire_engaged_expiry`

**Pass/Fail:** _______________

---

## SUMMARY

**Total Tests:** 10
**Passed:** _______________
**Failed:** _______________
**Pass Rate:** _______________%

**Overall Status:** ✅ PASS / ❌ FAIL

---

## NOTES

Record any issues, observations, or edge cases discovered during testing:

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

---

## SIGN-OFF

**Tester Signature:** _______________
**Date:** _______________
**Status:** ✅ APPROVED FOR DEPLOYMENT / ❌ NEEDS FIXES
