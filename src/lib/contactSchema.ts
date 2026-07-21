import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  message: z.string().trim().min(10).max(2000),
  /** Honeypot: un bot rellenará esto, un humano nunca lo verá */
  company: z.string().max(0).optional().or(z.literal("")),
  /** Marca de tiempo de cuando se montó el formulario, para detectar envíos robotizados demasiado rápidos */
  renderedAt: z.number(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const MIN_SUBMIT_SECONDS = 3;
