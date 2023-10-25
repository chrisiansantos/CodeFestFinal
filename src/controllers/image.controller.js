import fs from "fs-extra";
import path from "path";
import md5 from "md5";

import sidebar from "../helpers/sidebar";
import { randomNumber } from "../helpers/libs";
import { Image, Comment } from "../models";

// Controlador para mostrar una imagen y sus comentarios.
export const index = async (req, res, next) => {
  let viewModel = { image: {}, comments: [] };

  // Buscar la imagen en la base de datos según su ID.
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });

  // Si la imagen no existe, mostrar un error.
  if (!image) return next(new Error("Image does not exist"));

  // Incrementar las vistas de la imagen.
  const updatedImage = await Image.findOneAndUpdate(
    { _id: image.id },
    { $inc: { views: 1 } }
  ).lean();

  viewModel.image = updatedImage;

  // Obtener los comentarios asociados a la imagen.
  const comments = await Comment.find({ image_id: image._id }).sort({
    timestamp: 1,
  });

  viewModel.comments = comments;
  viewModel = await sidebar(viewModel);

  // Renderizar la página de la imagen con sus comentarios.
  res.render("image", viewModel);
};

// Controlador para crear una nueva imagen.
export const create = (req, res) => {
  const saveImage = async () => {
    const imgUrl = randomNumber();
    const images = await Image.find({ filename: imgUrl });

    if (images.length > 0) {
      saveImage();
    } else {
      // Rutas de la imagen temporal y de destino.
      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`./uploads/${imgUrl}${ext}`);

      // Validar la extensión de la imagen.
      if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".gif"
      ) {
        // Cambiar el nombre y mover la imagen al directorio de uploads.
        await fs.rename(imageTempPath, targetPath);

        // Crear una nueva imagen en la base de datos.
        const newImg = new Image({
          title: req.body.title,
          filename: imgUrl + ext,
          description: req.body.description,
        });

        // Guardar la imagen en la base de datos.
        const imageSaved = await newImg.save();

        // Redirigir a la lista de imágenes.
        res.redirect("/images/" + imageSaved.uniqueId);
      } else {
        // Eliminar la imagen si no tiene una extensión válida y mostrar un error.
        await fs.unlink(imageTempPath);
        res.status(500).json({ error: "Only Images are allowed" });
      }
    }
  };

  saveImage();
};

// Controlador para dar "me gusta" a una imagen.
export const like = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });

  if (image) {
    // Incrementar la cantidad de "me gusta" de la imagen y guardarla.
    image.likes = image.likes + 1;
    await image.save();
    res.json({ likes: image.likes });
  } else {
    res.status(500).json({ error: "Internal Error" });
  }
};

// Controlador para agregar un comentario a una imagen.
export const comment = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });

  if (image) {
    // Crear un nuevo comentario y asociarlo a la imagen.
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();

    // Redirigir a la imagen con el comentario anclado.
    res.redirect("/images/" + image.uniqueId + "#" + newComment._id);
  } else {
    // Redirigir al inicio si la imagen no se encuentra.
    res.redirect("/");
  }
};

// Controlador para eliminar una imagen.
export const remove = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });

  if (image) {
    // Eliminar la imagen, sus comentarios y el archivo asociado.
    await fs.unlink(path.resolve("./uploads/" + image.filename));
    await Comment.deleteMany({ image_id: image._id });
    await image.remove();
    res.json(true);
  } else {
    res.json({ response: "Bad Request." });
  }
};
