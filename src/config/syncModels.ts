import sequelize from "./db";

import "#domains/roles/model";
import "#domains/permisos/model";
import "#domains/rolPermisos/model";
import "#domains/empresas/model";

import { seedRoles } from "../seeders/roleSeeder";
import { seedPermisos } from "../seeders/permisoSeeder";
import { seedRolPermisos } from "../seeders/rolPermisoSeeder";

export const syncDatabase = async () => {
  try {
    await sequelize.authenticate();

    console.log("Base de datos conectada");

    await sequelize.sync({ alter: true });

    console.log("Tablas sincronizadas");

    await seedRoles();
    await seedPermisos();
    await seedRolPermisos();
  } catch (error) {
    console.error("Error al sincronizar DB ", error);
  }
};