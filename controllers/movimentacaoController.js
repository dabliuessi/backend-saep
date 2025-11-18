import { pool } from "../config/db.js";

export async function registrarMovimentacao(req, res) {
    try {
        const { produto_id, tipo, quantidade, observacao } = req.body;
        const usuario_id = req.user.id;

        await pool.query("BEGIN");

        // 1. Inserir movimentação
        const sqlMov = `
            INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, observacao)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pool.query(sqlMov, [produto_id, usuario_id, tipo, quantidade, observacao]);

        // 2. Atualizar estoque
        const operacao = tipo === "entrada" ? "+" : "-";

        const sqlEstoque = `
            UPDATE produtos
            SET estoque_atual = estoque_atual ${operacao} $1
            WHERE id = $2
        `;
        await pool.query(sqlEstoque, [quantidade, produto_id]);

        await pool.query("COMMIT");

        res.json({ mensagem: "Movimentação registrada com sucesso" });

    } catch (err) {
        await pool.query("ROLLBACK");
        res.status(400).json({ erro: "Erro ao registrar movimentação", detalhe: err.message });
    }
}
