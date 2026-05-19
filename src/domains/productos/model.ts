import { DataTypes } from "sequelize";
import sequelize from "#config/db";

const Producto = sequelize.define(
	"Producto",
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

		categoria_id: {
			type: DataTypes.BIGINT,
			allowNull: true,
			references: {
				model: "categorias",
				key: "id",
			},
		},

		laboratorio_id: {
			type: DataTypes.BIGINT,
			allowNull: true,
			references: {
				model: "laboratorios",
				key: "id",
			},
		},

		marca_id: {
			type: DataTypes.BIGINT,
			allowNull: true,
			references: {
				model: "marcas",
				key: "id",
			},
		},

		codigo: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},

		codigo_barras: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},

		nombre_generico: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},

		nombre_comercial: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},

		descripcion: {
			type: DataTypes.TEXT,
			allowNull: true,
		},

		concentracion: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},

		presentacion: {
			type: DataTypes.STRING(150),
			allowNull: true,
		},

		unidad_medida: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},

		principio_activo: {
			type: DataTypes.STRING(150),
			allowNull: true,
		},

		tipo_producto: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: "MEDICAMENTO",
			validate: {
				isIn: [["MEDICAMENTO", "DISPOSITIVO_MEDICO", "COSMETICO", "SUPLEMENTO", "HIGIENE", "OTRO"]],
			},
		},

		requiere_receta: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},

		es_controlado: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},

		es_fraccionable: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},

		precio_compra: {
			type: DataTypes.DECIMAL(12, 2),
			allowNull: false,
			defaultValue: 0,
			validate: {
				min: 0,
			},
		},

		precio_venta: {
			type: DataTypes.DECIMAL(12, 2),
			allowNull: false,
			defaultValue: 0,
			validate: {
				min: 0,
			},
		},

		stock_minimo: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			validate: {
				min: 0,
			},
		},

		stock_maximo: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			validate: {
				min: 0,
			},
		},

		afecto_igv: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},

		estado: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		tableName: "productos",
		timestamps: true,
		underscored: true,
	}
);

export default Producto;
