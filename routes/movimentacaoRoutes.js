import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import { registrarMovimentacao } from "../controllers/movimentacaoController.js";

const router = Router();

router.post("/", autenticar, registrarMovimentacao);

export default router;
