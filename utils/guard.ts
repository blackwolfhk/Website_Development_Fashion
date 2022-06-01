import { NextFunction, Response, Request } from "express";

export function isloggedin(req: Request, res: Response, next: NextFunction): void {

    //  if loggedin -> next()
    if (req.session['user']) {
        next()
    } else {
        throw new Error("please login")
    }
    // else throw new Error("please login")
}