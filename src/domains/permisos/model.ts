import { DataTypes } from "sequelize";
import sequelize from "#config/db";

const Permiso = sequelize.define(
  "Permiso",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    codigo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "permisos",
    timestamps: false,
  }
);

export default Permiso;