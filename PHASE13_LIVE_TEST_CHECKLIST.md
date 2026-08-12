# Phase 13 — Live Test Checklist (run these yourself, paste results back)

I audited the full source for all 18 tests (see chat for the summary + bugs found/fixed).
The steps below are the ones that need your MetaMask wallet or a phone camera — I can't do
either from here. Run each one, then paste back exactly what's asked for under "Report back."
I'll cross-check anything verifiable (transaction hashes against the Amoy explorer, etc.) once
you send it.

Use one real test student and one real certificate throughout, so later tests build on earlier
ones exactly as the plan describes.

---

## Test 1 — Admin Login
1. Open the app, go to Admin Login, click "Login as Admin."
2. Approve the MetaMask connection with your authorized admin wallet.
3. Confirm MetaMask is on Polygon Amoy (chain ID 80002 / 0x13882).
4. Confirm you land on the admin dashboard.
5. Optional negative check: switch MetaMask to a different, non-admin account and try again — it should be refused.

**Report back:** PASS/FAIL, any red error banner text, any browser console errors (F12 → Console).

---

## Test 2 — Student Registration (NEW admin page — see chat, this didn't exist before today)
1. Go to Admin → **Students** (new sidebar link).
2. Click "Add Student," fill in a real test student, submit.
3. Confirm the student appears in the table with a wallet address under "Wallet."
4. Log out, go to Student Login, log in as that student with the password you set.
5. Confirm no MetaMask prompt ever appears for the student.

**Report back:** PASS/FAIL, the student's USN, the wallet address shown in the table, any errors.

---

## Test 3 — Certificate PDF Upload
1. Admin → Issue Degree. Select the test student, fill in degree/department/year, upload a real PDF.
2. Submit.

**Report back:** PASS/FAIL, the certificate number and any error text. (I can't inspect your Supabase/DB directly, so also note whether the success message appeared.)

---

## Test 4 — QR Stamping
1. Admin → Issued Certificates → find the certificate → Download.
2. Open the **downloaded** PDF (not the original file you uploaded) and confirm a QR code appears in the bottom-right of page 1.
3. Scan it with your phone.

**Report back:** PASS/FAIL, the URL the QR opened (should be `<your frontend URL>/verify/<certificate number>`), and whether it landed on the correct certificate.

---

## Test 5 — Blockchain Minting
1. Admin → Issued Certificates → the test certificate → "Issue on Blockchain."
2. Confirm MetaMask opens on Polygon Amoy, confirm the transaction.
3. Wait for it to mine.
4. Copy the transaction hash and open it on the Amoy explorer: `https://amoy.polygonscan.com/tx/<hash>`.

**Report back:** the transaction hash, the token ID shown in the app, and paste me the explorer URL — I'll fetch it and confirm status/from/to independently.

---

## Test 6 — Student Portal
1. Log out of admin, log in as the test student.
2. My Certificates → confirm the certificate is listed as Minted.
3. Open its details, confirm the info matches what you entered in Test 3.
4. Download it — confirm it's the QR-stamped PDF (same as Test 4's download).
5. Confirm there's no admin-only control (Issue/Revoke/students list) visible anywhere in the student portal.

**Report back:** PASS/FAIL, anything mismatched or any admin control you can see as a student.

---

## Test 7 — Public Verification
1. Log out completely (or use a private/incognito window).
2. Go to `/verify`, enter the certificate number.
3. Confirm the certificate shows up as verified, with the right student/degree info and no private data (no email, no phone, no raw wallet key).
4. Scan the QR again from the incognito window and confirm it lands on the same result.

**Report back:** PASS/FAIL, the verification URL, and the exact status shown (VERIFIED / etc).

---

## Test 8 — Authentic PDF Verification
On the verification result page, upload the **exact PDF you downloaded in Test 4/6** (not a re-saved or re-exported copy) via "Verify PDF Authenticity."

**Report back:** PASS/FAIL and the exact result shown (should be AUTHENTIC).

---

## Test 9 — Tamper Detection
1. Make a copy of the authentic PDF.
2. Edit *only* a visible text field (e.g. open it in a PDF editor and change the student name or year) — do not touch/remove the QR.
3. Upload that modified copy on the same verification page.

**Report back:** PASS/FAIL and the result shown (should be TAMPERED, not AUTHENTIC).

---

## Test 10 — QR Copy/Forgery Test
1. Create a fake certificate PDF (any content).
2. Copy the QR image from the real certificate into the fake one.
3. Upload the fake+QR PDF for verification.

**Report back:** PASS/FAIL and the result (should be TAMPERED — the QR alone must not make it pass).

---

## Test 13 — Revoke Certificate
1. Admin → Issued Certificates → the test certificate (must be MINTED) → Revoke, give a reason.
2. Confirm the MetaMask transaction, wait for it to mine.
3. Copy the revoke transaction hash.

**Report back:** the revoke transaction hash, and confirm the certificate now shows REVOKED in the admin table.

Then repeat Test 7 (public verification) and Test 8 (upload the same authentic PDF) for this now-revoked certificate — expected: verification page shows REVOKED, and the PDF-authenticity upload also shows REVOKED (not AUTHENTIC).

**Report back:** both results.

---

## Everything else (Tests 11, 12, 14, 15, 16, 17, 18)
I already verified these directly from source code (invalid certificate numbers, invalid file
uploads, revoked-PDF logic, audit log completeness, role-based authorization, duplicate-mint
prevention, and a full pass over every page for dead links/placeholder content/responsive
layout) — see the report in chat. If you want to spot-check any of them live too, let me know
and I'll give you the exact steps.

---

**When you're done:** paste back whatever "Report back" lines you have (even partial — if
something fails partway, tell me exactly where and what error appeared, that's useful on its
own). I'll fold your results into the final Phase 13 report table.
