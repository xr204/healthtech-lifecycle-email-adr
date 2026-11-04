import { sendAppointmentConfirmation } from "../src/appointment_lifecycle.ts";

const to = process.env.DEMO_EMAIL_TO;
if (!to) throw new Error("DEMO_EMAIL_TO is required");

const result = await sendAppointmentConfirmation({
  patientEmail: to,
  patientFirstName: "Maya",
  clinicianName: "Dr. Chen",
  startsAt: "2026-11-04T09:30:00.000Z",
  appointmentId: "apt_2048"
});
console.log(`sent appointment confirmation: ${result.message_id}`);
