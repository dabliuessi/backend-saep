import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import produtoRoutes from "./routes/produtoRoutes.js";
import movimentacaoRoutes from "./routes/movimentacaoRoutes.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://backend-saep.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.options("*", cors()); 

app.use("/auth", authRoutes);
app.use("/produtos", produtoRoutes);
app.use("/movimentacoes", movimentacaoRoutes);

export default app;
