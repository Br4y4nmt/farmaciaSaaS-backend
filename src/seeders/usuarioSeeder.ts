import bcrypt from "bcryptjs";

import Usuario from "#domains/usuarios/model";
import Role from "#domains/roles/model";

export const seedUsuarioSuperAdmin = async () => {
  try {
    // BUSCAR ROL SUPER ADMIN
    const rolSuperAdmin = await Role.findOne({
      where: {
        codigo: "SUPER_ADMIN",
      },
    });

    if (!rolSuperAdmin) {
      console.log("Rol SUPER_ADMIN no encontrado ❌");
      return;
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash("123456", 10);

    // CREAR USUARIO
    await Usuario.findOrCreate({
      where: {
        correo: "superadmin@admin.com",
      },

      defaults: {
        empresa_id: 1,
        sucursal_id: null,

        rol_id: rolSuperAdmin.getDataValue("id"),

        nombres: "Super",
        apellidos: "Administrador",

        correo: "superadmin@admin.com",

        password: hashedPassword,

        telefono: "999999999",

        estado: true,
      },
    });

    console.log("Usuario SUPER ADMIN creado correctamente ✅");

  } catch (error) {
    console.error("Error al crear usuario super admin ❌", error);
  }
};