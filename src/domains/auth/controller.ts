import { Request, Response } from "express";

import Usuario from "#domains/usuarios/model";
import comparePassword from "#helpers/comparePassword";
import generateToken from "#helpers/generateToken";

export const login = async (
	req: Request,
	res: Response
) => {
	try {
		const { correo, password } = req.body as {
			correo?: string;
			password?: string;
		};

		if (!correo || !password) {
			return res.status(400).json({
				ok: false,
				message: "Correo y password son requeridos",
			});
		}

		const usuario = await Usuario.findOne({
			where: { correo },
		});

		if (!usuario) {
			return res.status(401).json({
				ok: false,
				message: "Credenciales inválidas",
			});
		}

		const usuarioData = usuario.get({ plain: true }) as {
			id: number;
			rol_id: number;
			empresa_id: number;
			estado?: boolean;
			password: string;
			[key: string]: unknown;
		};

		if (usuarioData.estado === false) {
			return res.status(403).json({
				ok: false,
				message: "Usuario inactivo",
			});
		}

		const isValid = await comparePassword(
			password,
			usuarioData.password
		);

		if (!isValid) {
			return res.status(401).json({
				ok: false,
				message: "Credenciales inválidas",
			});
		}

		await Usuario.update(
			{ ultimo_acceso: new Date() },
			{ where: { id: usuarioData.id } }
		);

		const token = generateToken({
			id: usuarioData.id,
			rol_id: usuarioData.rol_id,
			empresa_id: usuarioData.empresa_id,
		});

		const { password: _password, ...userSafe } = usuarioData;

		return res.json({
			ok: true,
			message: "Login exitoso",
			data: {
				token,
				user: userSafe,
			},
		});
	} catch (error) {
		console.error("Error en login:", error);
		return res.status(500).json({
			ok: false,
			message: "Error al iniciar sesion",
			error: error instanceof Error ? error.message : "Error desconocido",
		});
	}
};
