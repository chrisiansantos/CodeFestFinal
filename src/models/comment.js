import { Schema, model } from "mongoose";

// Definición del esquema para los comentarios
const CommentSchema = new Schema(
  {
    image_id: { type: Schema.Types.ObjectId }, // ID de la imagen relacionada
    email: { type: String }, // Correo electrónico del autor del comentario
    name: { type: String }, // Nombre del autor del comentario
    gravatar: { type: String }, // Gravatar del autor (imagen)
    comment: { type: String }, // Texto del comentario
    timestamp: { type: Date, default: Date.now }, // Marca de tiempo (fecha y hora)
  },
  {
    versionKey: false, // Evita la inclusión del campo "__v" en la base de datos
  }
);

// Propiedad virtual para relacionar los comentarios con las imágenes
CommentSchema.virtual("image")
  .set(function (image) {
    this._image = image;
  })
  .get(function () {
    return this._image;
  });

// Exporta el modelo "Comment" basado en el esquema
export default model("Comment", CommentSchema);
