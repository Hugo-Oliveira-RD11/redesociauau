"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrap = void 0;
const wrap = (fn) => function wrappedFn(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.wrap = wrap;
