import { Request, Response } from "express";
import Sucursal from "./model";
import Empresa from "#domains/empresas/model";

// Obtener sucursales
export const getSucursales = async (req: Request, res: Response) => {
  try {
    const sucursales = await Sucursal.findAll({
      include: [
        {
          model: Empresa,
          as: "empresa",
          attributes: ["id", "nombre", "ruc"],
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      ok: true,
      sucursales,
    });
  } catch (error) {
    console.error("Error al obtener sucursales:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al obtener las sucursales",
    });
  }
};


//crear sucursal
export const createSucursal = async (req: Request, res: Response) => {
  try {
    const {
      empresa_id,
      nombre,
      codigo,
      direccion_fiscal,
      direccion_comercial,
      departamento,
      provincia,
      distrito,
      telefono,
      correo_contacto,
      responsable,
      estado,
    } = req.body;

    if (!empresa_id) {
      return res.status(400).json({
        ok: false,
        message: "La empresa es obligatoria",
      });
    }

    if (!nombre) {
      return res.status(400).json({
        ok: false,
        message: "El nombre de la sucursal es obligatorio",
      });
    }

    const nuevaSucursal = await Sucursal.create({
      empresa_id,
      nombre,
      codigo,
      direccion_fiscal,
      direccion_comercial,
      departamento,
      provincia,
      distrito,
      telefono,
      correo_contacto,
      responsable,
      estado: estado ?? true,
    });

    return res.status(201).json({
      ok: true,
      message: "Sucursal creada correctamente",
      sucursal: nuevaSucursal,
    });
  } catch (error) {
    console.error("Error al crear sucursal:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al crear la sucursal",
    });
  }
};


// Actualizar sucursal
export const updateSucursal = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "ID de sucursal inválido",
      })
    }

    const {
      empresa_id,
      nombre,
      codigo,
      direccion_fiscal,
      direccion_comercial,
      departamento,
      provincia,
      distrito,
      telefono,
      correo_contacto,
      responsable,
      estado,
    } = req.body

    const sucursal = await Sucursal.findByPk(id)

    if (!sucursal) {
      return res.status(404).json({
        ok: false,
        message: "Sucursal no encontrada",
      })
    }

    if (!empresa_id) {
      return res.status(400).json({
        ok: false,
        message: "La empresa es obligatoria",
      })
    }

    if (!nombre) {
      return res.status(400).json({
        ok: false,
        message: "El nombre de la sucursal es obligatorio",
      })
    }

    await sucursal.update({
      empresa_id,
      nombre,
      codigo,
      direccion_fiscal,
      direccion_comercial,
      departamento,
      provincia,
      distrito,
      telefono,
      correo_contacto,
      responsable,
      estado: estado ?? true,
    })

    return res.status(200).json({
      ok: true,
      message: "Sucursal actualizada correctamente",
      sucursal,
    })
  } catch (error) {
    console.error("Error al actualizar sucursal:", error)

    return res.status(500).json({
      ok: false,
      message: "Error al actualizar la sucursal",
    })
  }
}


// Eliminar sucursal
export const deleteSucursal = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "ID de sucursal inválido",
      })
    }

    const sucursal = await Sucursal.findByPk(id)

    if (!sucursal) {
      return res.status(404).json({
        ok: false,
        message: "Sucursal no encontrada",
      })
    }

    await sucursal.destroy()

    return res.status(200).json({
      ok: true,
      message: "Sucursal eliminada correctamente",
    })
  } catch (error) {
    console.error("Error al eliminar sucursal:", error)

    return res.status(500).json({
      ok: false,
      message: "Error al eliminar la sucursal",
    })
  }
}