import { DataTypes } from "sequelize";
import sequelize from "#config/db";

const Usuario = sequelize.define(
  "Usuario",
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

    sucursal_id: {
      type: DataTypes.BIGINT,
      allowNull: true,

      references: {
        model: "sucursales",
        key: "id",
      },
    },

    rol_id: {
      type: DataTypes.BIGINT,
      allowNull: false,

      references: {
        model: "roles",
        key: "id",
      },
    },

    nombres: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    apellidos: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    ultimo_acceso: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

export default Usuario;