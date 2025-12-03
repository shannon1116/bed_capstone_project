// External imports
import { Request, Response, NextFunction } from "express";

// Internal imports
import { auth } from "../../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Handles setting roles (custom claims in Firebase) for a user
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
export const setCustomClaims = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { uid, roles } = req.body;

    const user = await auth.getUser(uid);
    const existingClaims = user.customClaims || {};

    await auth.setCustomUserClaims(uid, { ...existingClaims, ...roles });

    res.status(HTTP_STATUS.OK).json(
      successResponse({}, `Custom claims (roles) set for user: ${uid}`)
    );
  } catch (error: unknown) {
    next(error);
  }
};