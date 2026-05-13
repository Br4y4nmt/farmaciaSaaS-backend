import { DataTypes } from "sequelize";
import sequelize from "#config/db";

const Empresa = sequelize.define(
  "Empresa",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    ruc: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    direccion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    correo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    logo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    plan_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "empresas",
    timestamps: false,
  }
);

export default Empresa;