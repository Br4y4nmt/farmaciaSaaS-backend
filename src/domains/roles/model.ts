import { DataTypes } from "sequelize";
import sequelize from "#config/db";

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    nombre: {
      type: DataTypes.STRING(100),
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
    tableName: "roles",
    timestamps: false,
  }
);

export default Role;