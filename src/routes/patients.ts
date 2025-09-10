import express from "express";
import prisma from "../db";
import { authMiddleware } from "../utils/auth";

const router = express.Router();

router.post("/", authMiddleware, async (req: any, res) => {
  const { name, phone, email, notes } = req.body;
  const patient = await prisma.patient.create({ data: { name, phone, email, notes } });
  res.json(patient);
});

router.get("/", authMiddleware, async (_req: any, res) => {
  const patients = await prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
  res.json(patients);
});

export default router;
