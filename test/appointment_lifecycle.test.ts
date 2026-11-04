import assert from "node:assert/strict";
import { appointmentNotice, renderAppointmentNotice } from "../src/appointment_lifecycle.ts";

const valid = {
  patientEmail: "maya@example.com",
  patientFirstName: "Maya",
  clinicianName: "Dr. Chen",
  startsAt: "2026-11-04T09:30:00.000Z",
  appointmentId: "apt_2048"
};

assert.equal(appointmentNotice.safeParse(valid).success, true);
assert.equal(appointmentNotice.safeParse({ ...valid, patientEmail: "not-an-email" }).success, false);
assert.match(renderAppointmentNotice(valid).subject, /^Appointment confirmed for/);
assert.match(renderAppointmentNotice(valid).html, /Keep this reference: apt_2048/);
console.log("appointment boundary and lifecycle decision passed");
