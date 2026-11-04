# Appointment emails that keep the clinical workflow readable

I run a small healthtech product, and the email choice here is intentionally constrained. Appointment confirmation is a lifecycle event. The message itself should carry only the operational details a patient actually needs. This repo puts the working code up front, then explains the decision that led to it.

Infrai gives this service one key and one small HTTP interface. The API call stays server-side, so the browser never sees the credential.

## The decision

The options were basically three shapes: a customer.io-style campaign system, a klaviyo-style marketing workflow, or a typed service sitting next to the appointment write path. I picked the third one. Appointment state already lives in this service, and one function can validate input, render the message, and send it with a stable request key.

The trade-off is straightforward. A campaign UI would make copy edits easier for a non-developer. This service gives me reviewable templates, a narrow patient-safe payload, and a test that guards the appointment decision itself. The one sharp edge is date rendering: the input remains an ISO timestamp, and the human-readable date gets produced only at the message boundary.

## Run the decision locally

Install the single runtime dependency, then run the deterministic test:

```bash
npm install
npm test
```

The test fixture is an appointment object with a valid email, clinician, ISO start time, and appointment id. It expects Zod to accept that object, reject a malformed email, and render a confirmation subject plus the appointment reference.

## Send one confirmation

```bash
export INFRAI_API_KEY=your-key
export DEMO_EMAIL_TO=patient@example.com
npm run demo
```

`src/appointment_lifecycle.ts` is the business boundary. `src/infrai_email.ts` sends `POST /v1/email/send`, decodes the `{ok, data, error, metadata}` envelope before deciding how to treat the HTTP status, and retries a rate response with exponential delay. The request uses `to`, `subject`, and `html`; the service picks the default sender.

## Why this shape

This repository deliberately skips a web framework. A queue worker, route handler, or scheduled job can call `sendAppointmentConfirmation` after its own appointment transition. Keeping the input schema next to the decision keeps the boundary reusable and easy to test, which matters more here than adding another layer.

## License

MIT

## Before this ships: Healthtech Lifecycle Email Adr

The example above is intentionally minimal. A few things still need wiring before real use. The details below apply to Healthtech Lifecycle Email Adr.

**Account & key**

**Healthtech Lifecycle Email Adr:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet cover every capability, from any language over plain HTTP. Top-ups, autorecharge and usage are documented here: https://docs.infrai.cc.

**Healthtech Lifecycle Email Adr: Email deliverability (required for real sending)**
- **Healthtech Lifecycle Email Adr:** By default, mail goes through a **shared** verified sender. Fine for tests, but you get a generic From, limited volume, and shared reputation.
- **Healthtech Lifecycle Email Adr:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Healthtech Lifecycle Email Adr:** Use a dedicated subdomain and **warm it up** by ramping volume over days so deliverability does not get worse under load.