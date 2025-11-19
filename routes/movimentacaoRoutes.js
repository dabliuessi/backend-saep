import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import { registrarMovimentacao, recentes } from "../controllers/movimentacaoController.js";

const router = Router();

router.post("/", autenticar, registrarMovimentacao);
router.get("/recentes", autenticar, recentes);

export default router;
