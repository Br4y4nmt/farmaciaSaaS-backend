import { DataTypes } from "sequelize";
import sequelize from "#config/db";

const RolPermiso = sequelize.define(
  "RolPermiso",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    rol_id: {
      type: DataTypes.BIGINT,
      allowNull: false,

      references: {
        model: "roles",
        key: "id",
      },
    },

    permiso_id: {
      type: DataTypes.BIGINT,
      allowNull: false,

      references: {
        model: "permisos",
        key: "id",
      },
    },
  },
  {
    tableName: "rol_permisos",
    timestamps: false,
  }
);

export default RolPermiso;