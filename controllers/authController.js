import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registrar(req, res) {
    try {
        const { nome, email, senha, tipo } = req.body;

        const senhaHash = await bcrypt.hash(senha, 10);

        const sql = `
            INSERT INTO usuarios (nome, email, senha, tipo)
            VALUES ($1, $2, $3, $4)
            RETURNING id, nome, email, tipo
        `;

        const result = await pool.query(sql, [nome, email, senhaHash, tipo || "usuario"]);

        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ erro: "Erro ao registrar usuário", detalhe: err.message });
    }
}

export async function login(req, res) {
    try {
        const { email, senha } = req.body;

        const sql = `SELECT * FROM usuarios WHERE email = $1`;
        const result = await pool.query(sql, [email]);

        if (result.rows.length === 0)
            return res.status(404).json({ erro: "Usuário não encontrado." });

        const usuario = result.rows[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta)
            return res.status(401).json({ erro: "Senha inválida." });

        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao fazer login", detalhe: err.message });
    }
}
