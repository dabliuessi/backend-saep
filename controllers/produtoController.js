import { pool } from "../config/db.js";

export async function listarProdutos(req, res) {
    const result = await pool.query("SELECT * FROM produtos ORDER BY nome");
    res.json(result.rows);
}

export async function criarProduto(req, res) {
    try {
        const {
            nome, marca, modelo, tipo,
            material_cabo, tamanho, peso, tensao,
            descricao, estoque_atual, estoque_minimo
        } = req.body;

        const sql = `
            INSERT INTO produtos
            (nome, marca, modelo, tipo, material_cabo, tamanho, peso, tensao, 
             descricao, estoque_atual, estoque_minimo)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *
        `;

        const values = [
            nome, marca, modelo, tipo, material_cabo, tamanho, peso, tensao,
            descricao, estoque_atual, estoque_minimo
        ];

        const result = await pool.query(sql, values);
        res.json(result.rows[0]);

    } catch (err) {
        res.status(400).json({ erro: "Erro ao criar produto", detalhe: err.message });
    }
}

export async function editarProduto(req, res) {
    try {
        const { id } = req.params;

        const {
            nome, marca, modelo, tipo,
            material_cabo, tamanho, peso, tensao,
            descricao, estoque_atual, estoque_minimo
        } = req.body;

        const sql = `
            UPDATE produtos
            SET nome = $1,
                marca = $2,
                modelo = $3,
                tipo = $4,
                material_cabo = $5,
                tamanho = $6,
                peso = $7,
                tensao = $8,
                descricao = $9,
                estoque_atual = $10,
                estoque_minimo = $11
            WHERE id = $12
            RETURNING *
        `;

        const valores = [
            nome, marca, modelo, tipo,
            material_cabo, tamanho, peso, tensao,
            descricao, estoque_atual, estoque_minimo,
            id
        ];

        const result = await pool.query(sql, valores);

        if (result.rows.length === 0)
            return res.status(404).json({ erro: "Produto não encontrado." });

        res.json(result.rows[0]);

    } catch (err) {
        res.status(400).json({ erro: "Erro ao editar produto", detalhe: err.message });
    }
}

export async function excluirProduto(req, res) {
    try {
        const { id } = req.params;

        const sql = `DELETE FROM produtos WHERE id = $1 RETURNING *`;
        const result = await pool.query(sql, [id]);

        if (result.rows.length === 0)
            return res.status(404).json({ erro: "Produto não encontrado." });

        res.json({ mensagem: "Produto excluído com sucesso" });

    } catch (err) {
        res.status(400).json({ erro: "Erro ao excluir produto", detalhe: err.message });
    }
}

