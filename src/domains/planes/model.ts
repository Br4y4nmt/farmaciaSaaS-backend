import { DataTypes } from "sequelize";
import sequelize from "#config/db";

const Plan = sequelize.define(
  "Plan",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    precio_mensual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    precio_anual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    max_sucursales: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    max_usuarios: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    max_productos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    max_comprobantes_mensuales: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    incluye_soporte: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    incluye_facturacion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    incluye_reportes: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    incluye_multi_sucursal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    incluye_backup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "planes",
    timestamps: false,
  }
);

export default Plan;