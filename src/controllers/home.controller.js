// Importar el helper de la barra lateral y el modelo de imágenes.
import sidebar from "../helpers/sidebar";
import { Image } from "../models";

// Controlador para mostrar la página de inicio.
export const index = async (req, res, next) => {
  try {
    // Consultar las imágenes ordenadas por fecha descendente.
    const images = await Image.find()
      .sort({ timestamp: -1 })
      .lean({ virtuals: true });

    // Crear un objeto de vista con un array de imágenes.
    let viewModel = { images: [] };
    viewModel.images = images;

    // Completar el objeto de vista con datos de la barra lateral.
    viewModel = await sidebar(viewModel);

    // Renderizar la página de inicio con la vista completa.
    res.render("index", viewModel);
  } catch (error) {
    next(error);
  }
};
