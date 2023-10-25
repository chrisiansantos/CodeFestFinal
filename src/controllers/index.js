import * as controllers from "./controllers";

// Ahora puedes acceder a los controladores de la siguiente manera:
controllers.authCtrl.renderSignUp(req, res);
controllers.imageCtrl.index(req, res, next);
controllers.homeCtrl.index(req, res);
