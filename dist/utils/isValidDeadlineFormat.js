"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDeadlineFormat = isValidDeadlineFormat;
function isValidDeadlineFormat(deadline) {
    if (!deadline)
        return false;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = deadline.match(regex);
    if (!match)
        return false;
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    const date = new Date(year, month, day);
    return (date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day);
}
