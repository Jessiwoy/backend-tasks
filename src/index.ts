import "dotenv/config";
import express from "express";
import cors from "cors";
import task from "./routes/tasks";
import comment from "./routes/comments";
import profile from "./routes/profile";
import users from "./routes/users";
import auth from "./routes/auth";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/tasks", task);
app.use("/comments", comment);
app.use("/profile", profile);
app.use("/users", users);
app.use("/auth", auth);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
