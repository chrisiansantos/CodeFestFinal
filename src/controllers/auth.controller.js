// Importar Passport para la autenticación.
import passport from "passport";

// Renderizar la página de registro.
export const renderSignUp = (req, res) => {
  res.render("authentication/signup", {
    layout: "nostats",
  });
};

// Renderizar la página de inicio de sesión.
export const renderSignIn = (req, res) => {
  res.render("authentication/signin", {
    layout: "nostats",
  });
};

// Manejar la autenticación al registrarse.
export const signUp = passport.authenticate("signup", {
  successRedirect: "/auth/signin", // Redirige al inicio de sesión después del registro exitoso.
  failureRedirect: "/auth/signup", // Redirige al registro si hay un error.
  failureFlash: true, // Habilita mensajes flash en caso de fallo.
});

// Manejar la autenticación al iniciar sesión.
export const signIn = passport.authenticate("signin", {
  successRedirect: "/", // Redirige al inicio después del inicio de sesión exitoso.
  failureRedirect: "/auth/signin", // Redirige al inicio de sesión si hay un error.
  failureFlash: true, // Habilita mensajes flash en caso de fallo.
});

// Renderizar la página de perfil del usuario.
export const profile = (req, res) => {
  res.render("authentication/profile");
};

// Cerrar sesión del usuario.
export const logout = (req, res) => {
  req.logout(); // Cierra la sesión del usuario.
  res.redirect("/"); // Redirige al inicio.
};
