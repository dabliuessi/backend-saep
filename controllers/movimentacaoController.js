import { pool } from "../config/db.js";

export async function registrarMovimentacao(req, res) {
    try {
        const { produto_id, tipo, quantidade, observacao } = req.body;
        const usuario_id = req.user.id;

        await pool.query("BEGIN");
        const sqlMov = `
            INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, observacao)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pool.query(sqlMov, [produto_id, usuario_id, tipo, quantidade, observacao]);
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

export async function recentes(req, res) {
    const sql = `
    SELECT m.*, p.nome AS nome_produto, u.nome AS usuario_nome
    FROM movimentacoes m
    LEFT JOIN produtos p ON p.id = m.produto_id
    LEFT JOIN usuarios u ON u.id = m.usuario_id
    ORDER BY m.criado_em DESC
    LIMIT 30
  `;
    const result = await pool.query(sql);
    res.json(result.rows);
}
