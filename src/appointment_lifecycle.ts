import { z } from "zod";
import { infrai } from "./infrai_email.ts";

export const appointmentNotice = z.object({
  patientEmail: z.string().email(),
  patientFirstName: z.string().min(1),
  clinicianName: z.string().min(1),
  startsAt: z.string().datetime(),
  appointmentId: z.string().min(1)
});

export type AppointmentNotice = z.infer<typeof appointmentNotice>;

export function renderAppointmentNotice(input: AppointmentNotice): { subject: string; html: string } {
  const data = appointmentNotice.parse(input);
  const date = new Date(data.startsAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  return {
    subject: `Appointment confirmed for ${date}`,
    html: `<p>Hi ${data.patientFirstName},</p><p>Your appointment with ${data.clinicianName} is confirmed for ${date}.</p><p>Keep this reference: ${data.appointmentId}.</p>`
  };
}

export async function sendAppointmentConfirmation(input: unknown) {
  const data = appointmentNotice.parse(input);
  const rendered = renderAppointmentNotice(data);
  return infrai.email.send({ to: data.patientEmail, subject: rendered.subject, html: rendered.html }, `appointment:${data.appointmentId}`);
}
