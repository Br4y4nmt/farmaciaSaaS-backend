import Role from "#domains/roles/model";

export const seedRoles = async () => {
  try {
    const roles = [
      {
        codigo: "SUPER_ADMIN",
        nombre: "Super Administrador",
      },
      {
        codigo: "ADMIN_EMPRESA",
        nombre: "Administrador Empresa",
      },
      {
        codigo: "GERENTE",
        nombre: "Gerente",
      },
      {
        codigo: "CAJERO",
        nombre: "Cajero",
      },
      {
        codigo: "INVENTARIO",
        nombre: "Encargado Inventario",
      },
      {
        codigo: "FARMACEUTICO",
        nombre: "Farmacéutico",
      },
      {
        codigo: "CONTADOR",
        nombre: "Contador",
      },
    ];

    for (const role of roles) {
      await Role.findOrCreate({
        where: {
          codigo: role.codigo,
        },
        defaults: role,
      });
    }

    console.log("Roles creados correctamente ✅");
  } catch (error) {
    console.error("Error al crear roles ❌", error);
  }
};