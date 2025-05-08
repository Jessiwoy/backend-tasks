import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import firebaseServiceAccount from "../../firebase-service-account.json";
import { ServiceAccount } from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount as ServiceAccount),
});

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token ausente" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    return next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }
};

export default authMiddleware;
