// Webflow Cloud build-time secret probe (used by Webflow Cloud's end-to-end
// tests).
//
// Prints the E2E_TEST_SECRET environment variable during the production build,
// behind a stable marker, so the end-to-end tests can verify that Webflow Cloud
// redacts build-time secret values from build logs. It is a deliberate no-op
// unless E2E_TEST_SECRET is set, so a normal build (local dev or a real deploy)
// prints nothing and behaves identically.
const MARKER = '[webflow-cloud-e2e] build-time secret probe';

const value = process.env.E2E_TEST_SECRET;
if (value) {
  // Emit line by line so a multiline secret is printed one line at a time.
  for (const line of value.split('\n')) {
    console.log(`${MARKER} E2E_TEST_SECRET=${line}`);
  }
}
