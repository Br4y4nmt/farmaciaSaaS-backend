import { Request, Response, NextFunction } from "express";
import { Transaction, Op } from "sequelize";
import sequelize from "#config/db";
import Empresa from "#domains/empresas/model";
import Usuario from "#domains/usuarios/model";
import Role from "#domains/roles/model";
import Plan from "#domains/planes/model";
import hashPassword from "#helpers/hashPassword";


// Obtener empresas
export const getEmpresas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = "1",
      limit = "10",
      nombre,
      estado,
    } = req.query as Record<string, string>;

    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNumber - 1) * limitNumber;
    const where: Record<string, any> = {};

    if (nombre) {
      where.nombre = { [Op.like]: `%${nombre}%` };
    }

    if (estado !== undefined) {
      where.estado = estado === "true";
    }

    const { count, rows } = await Empresa.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit: limitNumber,
      offset,
    include: [
      {
        model: Plan,
        as: "plan",
        attributes: ["id", "nombre"],
      },
    ],
    });

    return res.status(200).json({
      ok: true,
      data: {
        total: count,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(count / limitNumber),
        empresas: rows,
      },
    });
  } catch (error) {
    next(error);
  }
};


//crear empresa y su usuario administrador
export const createEmpresa = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const t: Transaction = await sequelize.transaction();

  try {
    const {
      nombre,
      ruc,
      direccion,
      telefono,
      correo,
      plan_id,
      fecha_inicio,
      fecha_vencimiento,
      admin_nombres,
      admin_apellidos,
      admin_correo,
      admin_password,
      admin_telefono,
    } = req.body as Record<string, any>;

    if (!nombre) {
      await t.rollback();
      return res.status(400).json({ ok: false, message: "El nombre de la empresa es requerido" });
    }

    if (!admin_nombres || !admin_apellidos || !admin_correo || !admin_password) {
      await t.rollback();
      return res.status(400).json({ ok: false, message: "Los datos del administrador son requeridos" });
    }

    const rolAdmin = await Role.findOne({
      where: { codigo: "ADMIN_EMPRESA" },
      transaction: t,
    });

    if (!rolAdmin) {
      await t.rollback();
      return res.status(500).json({ ok: false, message: "Rol ADMIN_EMPRESA no encontrado" });
    }

    const rol_id = rolAdmin.getDataValue("id") as number;
    const empresa = await Empresa.create(
      {
        nombre,
        ruc: ruc ?? null,
        direccion: direccion ?? null,
        telefono: telefono ?? null,
        correo: correo ?? null,
        plan_id: plan_id ?? null,
        fecha_inicio: fecha_inicio ?? null,
        fecha_vencimiento: fecha_vencimiento ?? null,
      },
      { transaction: t }
    );

    const empresa_id = empresa.getDataValue("id") as number;
    const passwordHash = await hashPassword(admin_password);

    const usuario = await Usuario.create(
      {
        empresa_id,
        sucursal_id: null,
        rol_id,
        nombres: admin_nombres,
        apellidos: admin_apellidos,
        correo: admin_correo,
        password: passwordHash,
        telefono: admin_telefono ?? null,
        estado: true,
      },
      { transaction: t }
    );

    await t.commit();

    const { password: _, ...usuarioSafe } = usuario.get({ plain: true }) as Record<string, any>;

    return res.status(201).json({
      ok: true,
      data: {
        empresa: empresa.get({ plain: true }),
        usuario: usuarioSafe,
      },
    });

  } catch (error) {
    await t.rollback(); 
    next(error);
  }
};



// ── EDITAR EMPRESA ─────────────────────────────────────────────
export const updateEmpresa = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ ok: false, message: "ID inválido" });
    }

    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return res.status(400).json({ ok: false, message: "ID inválido" });
    }

    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
      return res.status(404).json({
        ok: false,
        message: "Empresa no encontrada",
      });
    }

    const {
      nombre,
      ruc,
      direccion,
      telefono,
      correo,
      plan_id,
      fecha_inicio,
      fecha_vencimiento,
      estado,
    } = req.body as Record<string, any>;

    await empresa.update({
      nombre: nombre ?? empresa.getDataValue("nombre"),
      ruc: ruc ?? empresa.getDataValue("ruc"),
      direccion: direccion ?? empresa.getDataValue("direccion"),
      telefono: telefono ?? empresa.getDataValue("telefono"),
      correo: correo ?? empresa.getDataValue("correo"),
      plan_id: plan_id ?? empresa.getDataValue("plan_id"),
      fecha_inicio: fecha_inicio ?? empresa.getDataValue("fecha_inicio"),
      fecha_vencimiento: fecha_vencimiento ?? empresa.getDataValue("fecha_vencimiento"),
      estado: estado !== undefined ? estado : empresa.getDataValue("estado"),
    });

    return res.status(200).json({
      ok: true,
      message: "Empresa actualizada correctamente",
      data: empresa,
    });

  } catch (error) {
    next(error);
  }
};


// ── ELIMINAR EMPRESA ───────────────────────────────────────────
export const deleteEmpresa = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ ok: false, message: "ID inválido" });
    }

    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return res.status(400).json({ ok: false, message: "ID inválido" });
    }

    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
      return res.status(404).json({
        ok: false,
        message: "Empresa no encontrada",
      });
    }

    await empresa.update({ estado: false });

    return res.status(200).json({
      ok: true,
      message: "Empresa eliminada correctamente",
    });

  } catch (error) {
    next(error);
  }
};

// obtener resumen de usuarios por empresa (solo para SUPER_ADMIN)
export const getEmpresasUsuariosResumen = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = "1",
      limit = "10",
      nombre,
      estado,
    } = req.query as Record<string, string>;

    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNumber - 1) * limitNumber;

    const where: Record<string, any> = {};

    if (nombre) {
      where.nombre = {
        [Op.like]: `%${nombre}%`,
      };
    }

    if (estado !== undefined) {
      where.estado = estado === "true";
    }

    const total = await Empresa.count({
      where,
    });

    const empresas = await Empresa.findAll({
      where,

      attributes: ["id", "nombre", "ruc", "estado"],

      include: [
        {
          model: Usuario,
          as: "usuarios",
          attributes: [
            "id",
            "nombres",
            "apellidos",
            "correo",
            "telefono",
            "rol_id",
            "estado",
          ],
          required: false,
          separate: true,
          include: [
            {
              model: Role,
              as: "rol",
              attributes: ["id", "nombre"],
              required: false,
            },
          ],
        },
        {
          model: Plan,
          as: "plan",
          attributes: ["id", "nombre"],
          required: false,
        },
      ],

      order: [["created_at", "DESC"]],
      limit: limitNumber,
      offset,
    });

    const resultado = empresas.map((empresa: any) => {
      const data = empresa.get({ plain: true });

      return {
        id: data.id,
        nombre: data.nombre,
        ruc: data.ruc,
        estado: data.estado,
        totalUsuarios: data.usuarios?.length || 0,
        plan: data.plan,
        usuarios:
          data.usuarios?.map((usuario: any) => ({
            id: usuario.id,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            telefono: usuario.telefono,
            rol_id: usuario.rol_id,
            rol_nombre: usuario.rol?.nombre ?? null,
            estado: usuario.estado,
          })) || [],
      };
    });

    return res.status(200).json({
      ok: true,
      data: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        empresas: resultado,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    console.log(error.sql);

    next(error);
  }
};


// actualizar suscripción de empresa (plan y fechas)
export const updateEmpresaSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id)

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'ID de empresa inválido',
      })
    }

    const { plan_id, fecha_inicio, fecha_vencimiento } = req.body

    const empresa = await Empresa.findByPk(id)

    if (!empresa) {
      return res.status(404).json({
        ok: false,
        message: 'Empresa no encontrada',
      })
    }

    await empresa.update({
      plan_id: plan_id || null,
      fecha_inicio: fecha_inicio || null,
      fecha_vencimiento: fecha_vencimiento || null,
    })

    return res.status(200).json({
      ok: true,
      message: 'Suscripción actualizada correctamente',
      data: empresa,
    })
  } catch (error) {
    next(error)
  }
}