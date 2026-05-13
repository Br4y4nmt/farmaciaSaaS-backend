import Role from "#domains/roles/model";
import Permiso from "#domains/permisos/model";
import RolPermiso from "#domains/rolPermisos/model";

export const seedRolPermisos = async () => {
  try {
    // SUPER ADMIN
    const superAdmin = await Role.findOne({
      where: {
        codigo: "SUPER_ADMIN",
      },
    });

    // ADMIN EMPRESA
    const adminEmpresa = await Role.findOne({
      where: {
        codigo: "ADMIN_EMPRESA",
      },
    });

    // TODOS LOS PERMISOS
    const permisos = await Permiso.findAll();

    // SUPER ADMIN -> TODOS LOS PERMISOS
    if (superAdmin) {
      for (const permiso of permisos) {
        await RolPermiso.findOrCreate({
          where: {
            rol_id: superAdmin.getDataValue("id"),
            permiso_id: permiso.getDataValue("id"),
          },
        });
      }
    }

    // ADMIN EMPRESA -> ALGUNOS PERMISOS
    if (adminEmpresa) {
      const permisosAdmin = [
        "USUARIOS_VER",
        "USUARIOS_CREAR",
        "ROLES_VER",
        "PRODUCTOS_VER",
        "PRODUCTOS_CREAR",
        "VENTAS_VER",
        "VENTAS_CREAR",
      ];

      for (const codigo of permisosAdmin) {
        const permiso = await Permiso.findOne({
          where: {
            codigo,
          },
        });

        if (permiso) {
          await RolPermiso.findOrCreate({
            where: {
              rol_id: adminEmpresa.getDataValue("id"),
              permiso_id: permiso.getDataValue("id"),
            },
          });
        }
      }
    }

    console.log("Rol permisos creados correctamente ✅");
  } catch (error) {
    console.error("Error al crear rol permisos ❌", error);
  }
};