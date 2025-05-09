"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPhoneNumberFormat = isValidPhoneNumberFormat;
const zod_1 = require("zod");
function isValidPhoneNumberFormat(phone_number) {
    if (!phone_number) {
        return false;
    }
    const phoneRegex = /^(\d{2})9\d{8}$/;
    const schema = zod_1.z.object({
        phone_number: zod_1.z.string().regex(phoneRegex, {
            message: "Número de telefone inválido. Use o padrão 11912345678.",
        }),
    });
    const result = schema.safeParse({ phone_number: phone_number });
    return result.success;
}
