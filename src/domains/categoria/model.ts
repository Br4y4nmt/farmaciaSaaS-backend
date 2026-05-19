import { DataTypes } from "sequelize";
import sequelize from "#config/db";

const Categoria = sequelize.define(
	"Categoria",
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

		parent_id: {
			type: DataTypes.BIGINT,
			allowNull: true,
			references: {
				model: "categorias",
				key: "id",
			},
		},

		nombre: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},

		descripcion: {
			type: DataTypes.TEXT,
			allowNull: true,
		},

		orden: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},

		estado: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		tableName: "categorias",
		timestamps: true,
		underscored: true,
	}
);

export default Categoria;
