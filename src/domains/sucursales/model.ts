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

    codigo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    direccion_fiscal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    direccion_comercial: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    departamento: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    provincia: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    distrito: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    correo_contacto: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    responsable: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "sucursales",
    timestamps: true,
    underscored: true,
  }
);

export default Sucursal;