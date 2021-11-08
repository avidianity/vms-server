"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorResponse = void 0;
function getErrorResponse(error) {
    if (error.response) {
        return error.response;
    }
    return null;
}
exports.getErrorResponse = getErrorResponse;
