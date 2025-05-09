import { z } from "zod";

export function isValidPhoneNumberFormat(phone_number: string): boolean {
  if (!phone_number) {
    return false;
  }

  const phoneRegex = /^(\d{2})9\d{8}$/;

  const schema = z.object({
    phone_number: z.string().regex(phoneRegex, {
      message: "Número de telefone inválido. Use o padrão 11912345678.",
    }),
  });

  const result = schema.safeParse({ phone_number: phone_number });
  return result.success;
}
