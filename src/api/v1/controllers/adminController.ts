import { Request, Response, NextFunction } from "express";

import { auth } from "../../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface SetCustomClaimsBody {
  uid: string;
  roles?: Record<string, any>;
  claims?: Record<string, any>;
}

export const setCustomClaims = async (
  req: Request<any, any, SetCustomClaimsBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const { uid, roles, claims } = req.body;

    if (!uid) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Missing required field: uid",
      });
      return;
    }

    const newClaims = roles ?? claims;

    if (!newClaims || typeof newClaims !== "object" || Array.isArray(newClaims)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error:
          "Roles must be a valid object (roles or claims missing or invalid)",
        received: newClaims,
      });
      return;
    }

    const user = await auth.getUser(uid);
    const existingClaims = user.customClaims || {};

    const updatedClaims = { ...existingClaims, ...newClaims };
    await auth.setCustomUserClaims(uid, updatedClaims);

    res.status(HTTP_STATUS.OK).json(
      successResponse(
        { updatedClaims },
        `Custom claims updated for user: ${uid}`
      )
    );
  } catch (error) {
    next(error);
  }
};