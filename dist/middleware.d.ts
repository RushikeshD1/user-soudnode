import type { NextFunction, Request, Response } from "express";
import { type IUser } from "./model.js";
export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}
export declare const isAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=middleware.d.ts.map