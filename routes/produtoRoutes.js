import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import { listarProdutos, criarProduto, editarProduto, excluirProduto } from "../controllers/produtoController.js";

const router = Router();

router.get("/", autenticar, listarProdutos);
router.post("/", autenticar, criarProduto);
router.put("/:id", autenticar, editarProduto);
router.delete("/:id", autenticar, excluirProduto);

export default router;
