import express from "express";
import prisma from "../db";
import { authMiddleware } from "../utils/auth";

const router = express.Router();

router.post("/", authMiddleware, async (req: any, res) => {
  const { patientId, startAt, endAt, notes } = req.body;
  const appt = await prisma.appointment.create({
    data: { patientId, startAt: new Date(startAt), endAt: new Date(endAt), notes }
  });
  res.json(appt);
});

router.get("/", authMiddleware, async (_req: any, res) => {
  const appts = await prisma.appointment.findMany({
    include: { patient: true },
    orderBy: { startAt: "asc" }
  });
  res.json(appts);
});

export default router;
