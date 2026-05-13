import { z } from "zod";

export const enrolmentSchema = z.object({
  fullName: z.string().min(3, "Name is too short"),
  email: z.string().email("Invalid email address"),
  dob: z.string().or(z.date()),
  programmeId: z.string().min(1, "Programme is required"),
  academicYear: z.string(),
  feeAmount: z.number().min(0),
  status: z.enum(["ENROLLED", "DEFERRED", "WITHDRAWN", "COMPLETED"]).optional(),
});
