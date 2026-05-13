import { DataTypes } from "sequelize";
import sequelize from "#config/db";

const Sucursal = sequelize.define(
  "Sucursal",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    empresa_id: {
      type: DataTypes.BIGINT,
      allowNull: false,

      references: {
        model: "empresas",
        key: "id",
      },
    },

    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    direccion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "sucursales",
    timestamps: false,
  }
);

export default Sucursal;