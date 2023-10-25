// Importar Passport y estrategia de autenticación local.
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models";

// Configurar estrategia de registro de usuarios.
passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      // Buscar si el correo electrónico ya existe.
      const userFound = await User.findOne({ email });

      // Devolver un error si el correo electrónico ya existe.
      if (userFound) {
        return done(null, false, { message: "El correo ya está en uso" });
      }

      // Crear un nuevo usuario.
      const newUser = new User();
      newUser.email = email;
      newUser.password = await User.encryptPassword(password);
      const userSaved = await newUser.save();

      // Crear un mensaje de éxito.
      req.flash("success", "Inicia sesión con tu nueva cuenta");

      // Devolver la sesión del usuario registrado.
      return done(null, userSaved);
    }
  )
);

// Configurar estrategia de inicio de sesión.
passport.use(
  "signin",
  new LocalStrategy(
    {
      passwordField: "password",
      usernameField: "email",
    },
    async (email, password, done) => {
      // Encontrar al usuario por su correo electrónico.
      const userFound = await User.findOne({ email });

      // Si el usuario no existe.
      if (!userFound) return done(null, false, { message: "Usuario no encontrado." });

      // Comprobar si la contraseña coincide.
      const match = await userFound.matchPassword(password);

      if (!match) return done(null, false, { message: "Contraseña incorrecta." });

      // Devolver el usuario autenticado.
      return done(null, userFound);
    }
  )
);

// Serializar y deserializar el usuario para la sesión.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = (await User.findById(id)).toObject();
    // Eliminar la contraseña del objeto de respuesta.
    if (user) {
      delete user.password;
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});
