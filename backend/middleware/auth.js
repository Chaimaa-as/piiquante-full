// Configure Auth Key
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

// Ce code est un middleware d'authentification basé sur JSON Web Tokens (JWT)
// pour une application Node.js avec Express. Il sert à vérifier si l'utilisateur
// qui fait une requête est authentifié. Voici une explication détaillée de chaque partie du code :

// 1. `const jwt = require('jsonwebtoken');` :
// Cette ligne importe le module 'jsonwebtoken', qui fournit des méthodes pour créer,
// signer et vérifier des tokens JWT.

// 2. `module.exports = (req, res, next) => { ... }` :
// Ce code définit et exporte un middleware Express. Les middlewares sont des fonctions
// qui ont accès aux objets 'req' (requête), 'res' (réponse) et 'next' (fonction
// pour passer au prochain middleware). Ce middleware sera utilisé pour protéger certaines
// routes et vérifier si l'utilisateur est authentifié.

// 3. `try { ... } catch (error) { ... }` : Le bloc 'try' contient le code qui vérifie
// l'authentification, et le bloc 'catch' gère les erreurs qui pourraient survenir
// lors de l'exécution du code dans le bloc 'try'.

// 4. `const token = req.headers.authorization.split(' ')[1];` :
// Cette ligne extrait le token JWT de l'en-tête 'Authorization' de la requête HTTP.
// L'en-tête 'Authorization' a généralement la forme "Bearer <token>",
// donc la fonction 'split()' est utilisée pour séparer la chaîne en deux parties,
// et la deuxième partie (l'index 1) contient le token JWT.

// 5. `const decodedToken = jwt.verify(token, process.env.TOKEN);` :
// Cette ligne utilise la méthode 'verify()' du module 'jsonwebtoken' pour vérifier
// si le token JWT est valide. La méthode prend en paramètres le token et la clé secrète
// (stockée dans la variable d'environnement 'process.env.TOKEN') utilisée pour signer le token.
// Si le token est valide, la méthode retourne un objet contenant les données décodées du token.

// 6. `const userId = decodedToken.userId;` :
// Cette ligne extrait l'identifiant de l'utilisateur (userId)
// à partir des données décodées du token.

// 7. `req.auth = { userId: userId };` :
// Cette ligne ajoute un nouvel objet 'auth' à l'objet 'req' (requête),
// qui contient l'identifiant de l'utilisateur (userId). Cela permet aux autres middlewares
// et aux contrôleurs d'accéder à l'identifiant de l'utilisateur pour effectuer d'autres
// vérifications ou opérations.

// 8. `next();` :
// Cette fonction appelle le prochain middleware dans la chaîne de middlewares Express.
// Si l'authentification est réussie, le traitement de la requête continue normalement.

// 9. `res.status(401).json({ error });` :
// Si une erreur se produit lors de l'exécution du code dans le bloc 'try',
// le bloc 'catch' attrape l'erreur et envoie une réponse HTTP
// avec le code d'état 401 (Non autorisé) et un objet JSON contenant l'erreur.
// Cela indique au client que l'authentification a échoué.
