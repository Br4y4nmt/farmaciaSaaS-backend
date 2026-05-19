import { DataTypes } from "sequelize";
import sequelize from "#config/db";

const Marca = sequelize.define(
  "Marca",
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
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    codigo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "marcas",
    timestamps: true,
    underscored: true,
  }
);

export default Marca;
