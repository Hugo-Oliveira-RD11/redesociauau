// declare namespace Express {
//   export interface Request {
//     user: any;
//   }
//   export interface Response {
//     user: any;
//   }
// }

import { Request } from "express";

export interface IRequest extends Request {
  user: any;
}
