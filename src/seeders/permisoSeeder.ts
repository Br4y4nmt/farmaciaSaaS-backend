import Permiso from "#domains/permisos/model";

export const seedPermisos = async () => {
  try {
    const permisos = [
      {
        codigo: "USUARIOS_VER",
        nombre: "Ver usuarios",
      },
      {
        codigo: "USUARIOS_CREAR",
        nombre: "Crear usuarios",
      },
      {
        codigo: "USUARIOS_EDITAR",
        nombre: "Editar usuarios",
      },
      {
        codigo: "USUARIOS_ELIMINAR",
        nombre: "Eliminar usuarios",
      },

      {
        codigo: "ROLES_VER",
        nombre: "Ver roles",
      },
      {
        codigo: "ROLES_CREAR",
        nombre: "Crear roles",
      },

      {
        codigo: "PRODUCTOS_VER",
        nombre: "Ver productos",
      },
      {
        codigo: "PRODUCTOS_CREAR",
        nombre: "Crear productos",
      },

      {
        codigo: "VENTAS_VER",
        nombre: "Ver ventas",
      },
      {
        codigo: "VENTAS_CREAR",
        nombre: "Crear ventas",
      },
    ];

    for (const permiso of permisos) {
      await Permiso.findOrCreate({
        where: {
          codigo: permiso.codigo,
        },

        defaults: permiso,
      });
    }

    console.log("Permisos creados correctamente");
  } catch (error) {
    console.error("Error al crear permisos", error);
  }
};