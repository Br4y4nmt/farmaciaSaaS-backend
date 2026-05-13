import Empresa from "#domains/empresas/model";

export const seedEmpresa = async () => {
  try {
    await Empresa.findOrCreate({
      where: {
        id: 1,
      },

      defaults: {
        nombre: "Empresa Demo",
        ruc: "12345678901",
        direccion: "Dirección demo",
        telefono: "999999999",
        correo: "empresa@demo.com",
      },
    });

    console.log("Empresa demo creada ✅");

  } catch (error) {
    console.error("Error al crear empresa demo ❌", error);
  }
};