import express from "express";
import prisma from "../db";
import bcrypt from "bcrypt";
import { signToken } from "../utils/auth";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash: hashed, role }
  });
  res.json(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken({ userId: user.id, role: user.role });
  res.json({ token, user });
});

export default router;
