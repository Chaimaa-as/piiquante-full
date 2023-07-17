// Importer package mongoose
const mongoose = require("mongoose");

// Importer package Express
const express = require("express");
// Créer Express app
const app = express();

// Appeler les routes créées précédemment : userRoute et sauceRoute
const userRoute = require("./router/userRoute");
const sauceRoute = require("./router/sauceRoute");

// dotenv pour cacher éléments sensibles
const dotEnv = require("dotEnv").config("./env");

// Importer package Body-parser
const bodyParser = require("body-parser");

// Importer path pour définir les chemins
const path = require("path");

// Helmet pour protéger les requêtes (entêtes): la solution préconisée pour le middleware Express.js pour protéger son application des vulnérabilités les plus courantes..
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Se connecter à la base de données avec id User et mot de passe
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.73rmxkv.mongodb.net/piiquante?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Utiliser l'intergiciel express.static pour servir des fichiers statiques, dans le cas présent : les images
app.use("/images", express.static(path.join(__dirname, "images")));
// Intercepte ttes les requetes qui ont un content type json (idem "bodyParser")
app.use(express.json());
// rend données exploitables
app.use(bodyParser.json());

// CORS MIDDLEWARES : Ajouter "CORS Headers" pour définir qui peut accéder à l'API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

// SECURITE
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(limiter);
app.use(xss());

// GESTION DES ROUTES PRINCIPALES DE L'API : AUTH / SAUCES / IMG----------------------------------------------------------
// Appeler les routes créées précédemment : userRoute et sauceRoute
app.use("/api/auth", userRoute);
app.use("/api/sauces", sauceRoute);

// -----------------------------------------------------------------------------------------------------------------------

// utiliser la méthode get() pour répondre uniquement aux demandes GET à cet endpoint ;
app.get("/api/sauces/:id", (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
});

// Exporter pour pouvoir utiliser
module.exports = app;

// Ce code est un middleware d'authentification pour une application Node.js utilisant Express et JSON Web Tokens (JWT). Le middleware est une fonction qui intercepte les requêtes HTTP pour vérifier si l'utilisateur est authentifié avant de les transmettre aux gestionnaires de routes appropriés.

// Voici une explication détaillée de chaque partie du code :

// 1. `const jwt = require('jsonwebtoken');` : Ceci importe la bibliothèque "jsonwebtoken" pour gérer les JSON Web Tokens.

// 2. `module.exports = (req, res, next) => {` : Ceci définit et exporte le middleware d'authentification comme une fonction anonyme. La fonction accepte trois arguments : `req` (la requête HTTP), `res` (la réponse HTTP) et `next` (une fonction pour passer au prochain middleware ou gestionnaire de route).

// 3. `try {` : La fonction tente d'exécuter le code suivant. Si une erreur se produit, le code passe à la section `catch`.

// 4. `const token = req.headers.authorization.split(' ')[1];` : Ceci extrait le token JWT de l'en-tête "Authorization" de la requête. L'en-tête "Authorization" est généralement formaté comme "Bearer [token]", donc en divisant la chaîne par un espace et en prenant le deuxième élément du tableau, on obtient le token.

// 5. `const decodedToken = jwt.verify(token, process.env.TOKEN);` : Ceci décode et vérifie le token JWT en utilisant la méthode "verify" de la bibliothèque "jsonwebtoken". Le deuxième argument est une clé secrète stockée dans une variable d'environnement pour assurer la sécurité.

// 6. `const userId = decodedToken.userId;` : Ceci extrait l'ID utilisateur du token décodé.

// 7. `req.auth = { userId: userId };` : Ceci ajoute l'ID utilisateur à l'objet de requête pour qu'il puisse être utilisé par les gestionnaires de routes ultérieurs.

// 8. `next();` : Ceci appelle la fonction "next" pour passer au middleware ou gestionnaire de route suivant.

// 9. `} catch(error) {` : Si une erreur se produit lors de l'exécution du code dans le bloc "try", le code passe à ce bloc "catch".

// 10. `res.status(401).json({ error });` : Ceci envoie une réponse HTTP avec un code d'état 401 (non autorisé) et un objet JSON contenant l'erreur.

// 11. `};` : Ceci ferme la fonction du middleware d'authentification.
