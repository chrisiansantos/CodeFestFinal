// Este módulo exporta un método "newest" que recupera los 5 comentarios más recientes, incluyendo información sobre las imágenes asociadas a cada comentario.
import { Comment, Image } from "../models";

export default {
  async newest() {
    const comments = await Comment.find().limit(5).sort({ timestamp: -1 });
    
    for (const comment of comments) {
      const image = await Image.findOne({ _id: comment.image_id });
      comment.image = image;
    }
    
    return comments;
  },
};
