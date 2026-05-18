import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import Usuario from "./model";
import Empresa from "#domains/empresas/model";
import Sucursal from "#domains/sucursales/model";
import Role from "#domains/roles/model";

export const createUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      empresa_id,
      sucursal_id,
      rol_id,
      nombres,
      apellidos,
      correo,
      password,
      telefono,
    } = req.body;

    if (!empresa_id || !rol_id || !nombres || !apellidos || !correo || !password) {
      return res.status(400).json({
        ok: false,
        message: "Empresa, rol, nombres, apellidos, correo y contraseña son obligatorios",
      });
    }

    const empresa = await Empresa.findByPk(empresa_id);

    if (!empresa) {
      return res.status(404).json({
        ok: false,
        message: "La empresa no existe",
      });
    }

    const rol = await Role.findByPk(rol_id);

    if (!rol) {
      return res.status(404).json({
        ok: false,
        message: "El rol no existe",
      });
    }

    const rolData = rol.get({ plain: true }) as any;

    if (rolData.codigo === "SUPER_ADMIN") {
      return res.status(403).json({
        ok: false,
        message: "No se puede crear un usuario con rol SUPER_ADMIN desde este módulo",
      });
    }

    if (sucursal_id) {
      const sucursal = await Sucursal.findOne({
        where: {
          id: sucursal_id,
          empresa_id,
        },
      });

      if (!sucursal) {
        return res.status(404).json({
          ok: false,
          message: "La sucursal no existe o no pertenece a la empresa seleccionada",
        });
      }
    }

    const existeCorreo = await Usuario.findOne({
      where: {
        correo,
      },
    });

    if (existeCorreo) {
      return res.status(409).json({
        ok: false,
        message: "El correo ya está registrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      empresa_id,
      sucursal_id: sucursal_id || null,
      rol_id,
      nombres,
      apellidos,
      correo,
      password: hashedPassword,
      telefono: telefono || null,
      estado: true,
    });

    const usuarioData = usuario.get({ plain: true }) as any;
    delete usuarioData.password;

    return res.status(201).json({
      ok: true,
      message: "Usuario creado correctamente",
      data: usuarioData,
    });
  } catch (error) {
    next(error);
  }
};