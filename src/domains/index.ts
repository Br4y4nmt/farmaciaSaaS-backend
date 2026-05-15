import Empresa from "./empresas/model";
import Sucursal from "./sucursales/model";
import Usuario from "./usuarios/model";
import Role from "./roles/model";
import Permiso from "./permisos/model";
import RolPermiso from "./rolPermisos/model";
import Plan from "./planes/model";

/* =========================
   EMPRESAS - SUCURSALES
========================= */

Empresa.hasMany(Sucursal, {
  foreignKey: "empresa_id",
  as: "sucursales",
});

Sucursal.belongsTo(Empresa, {
  foreignKey: "empresa_id",
  as: "empresa",
});

/* =========================
   EMPRESAS - USUARIOS
========================= */

Empresa.hasMany(Usuario, {
  foreignKey: "empresa_id",
  as: "usuarios",
});

Usuario.belongsTo(Empresa, {
  foreignKey: "empresa_id",
  as: "empresa",
});

/* =========================
   SUCURSALES - USUARIOS
========================= */

Sucursal.hasMany(Usuario, {
  foreignKey: "sucursal_id",
  as: "usuarios",
});

Usuario.belongsTo(Sucursal, {
  foreignKey: "sucursal_id",
  as: "sucursal",
});

/* =========================
   ROLES - USUARIOS
========================= */

Role.hasMany(Usuario, {
  foreignKey: "rol_id",
  as: "usuarios",
});

Usuario.belongsTo(Role, {
  foreignKey: "rol_id",
  as: "rol",
});

/* =========================
   ROLES - PERMISOS
========================= */

Role.belongsToMany(Permiso, {
  through: RolPermiso,
  foreignKey: "rol_id",
  otherKey: "permiso_id",
  as: "permisos",
});

Permiso.belongsToMany(Role, {
  through: RolPermiso,
  foreignKey: "permiso_id",
  otherKey: "rol_id",
  as: "roles",
});
Plan.hasMany(Empresa, {
  foreignKey: "plan_id",
  as: "empresas",
});

Empresa.belongsTo(Plan, {
  foreignKey: "plan_id",
  as: "plan",
});
export {
  Empresa,
  Sucursal,
  Usuario,
  Role,
  Permiso,
  RolPermiso,
  Plan,
};