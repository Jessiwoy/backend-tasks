import "dotenv/config";
import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks";
import commentRoutes from "./routes/comments";
import profileRoutes from "./routes/profile";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/tasks", taskRoutes);
app.use("/comments", commentRoutes);
app.use("/profile", profileRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
