// Permet de "hasher" les mots de passe (bcrypt est un package de cryptage installé avec npm).
const bcrypt = require("bcrypt");

// Nous utilisons notre modèle Mongoose pour vérifier l'e-mail
const User = require("../models/userModel");

// Permet de générer des tokens d'authentification chiffrés qui peuvent être utilisés pour l'autorisation.
const jwt = require("jsonwebtoken");

// Authentification_Pour créer un nouvel utilisateur dans la base de données USER.
exports.signup = (req, res, next) => {
  console.log(req.body);
  // nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois.
  bcrypt
    .hash(req.body.password, 10)
    // La méthode  hash()  de bcrypt crée un hash crypté des mots de passe de vos utilisateurs pour les enregistrer de manière sécurisée dans la base de données.
    .then((hashPassword) => {
      // nous créons un utilisateur et l'enregistrons dans la base de données
      const newUser = new User({
        email: req.body.email,
        password: hashPassword,
      });
      newUser
        .save()
        .then(() => res.status(201).json({ message: " utilisateur créé !" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Authentification_Pour connecter un utilisateur
exports.login = (req, res, next) => {
  // Rechercher si l'utilisateur est enregistré dans la base de données USER en utilisant la méthode findOne() dans notre modèle
  // find a User by email: findOne({ where: { email: ... } })
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: "Paire identifiant et mot de passe incorrecte" });
      }
      // Utiliser la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la BDD.
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // S'ils ne correspondent pas, nous renvoyons une erreur401 Unauthorized avec le même message que lorsque l’utilisateur n’a pas été trouvé,
          if (!valid) {
            return res.status(401).json({
              error: "Paire identifiant et mot de passe incorrecte !",
            });
          }
          // S'ils correspondent, nous renvoyons l'ID de l'utilisateur et un token.
          res.status(200).json({
            userId: user._id,
            // Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.
            token: jwt.sign(
              // Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token).
              { userId: user._id },
              // Nous renvoyons le token au front-end avec notre réponse.
              process.env.TOKEN,
              //Nous définissons la durée de validité du token à 24 heures.
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Ce code est un contrôleur d'authentification pour une application Node.js,
// utilisant le package bcrypt pour sécuriser les mots de passe et JSON Web Token (JWT)
// pour l'authentification. Il exporte deux fonctions, `signup` et `login`,
// qui gèrent respectivement la création d'un nouvel utilisateur et la connexion
// d'un utilisateur existant.

// 1. Le code commence par importer trois packages :
//    - `bcrypt` : un package de hachage de mots de passe pour sécuriser les mots de passe
// stockés dans la base de données.
//    - `User` : un modèle Mongoose pour interagir avec la collection d'utilisateurs
// dans la base de données.
//    - `jsonwebtoken` : un package pour créer et vérifier les JSON Web Tokens (JWT)
// pour l'authentification.

// 2. La fonction `signup` permet de créer un nouvel utilisateur :
//    - Elle récupère les données du corps de la requête (email et mot de passe)
// et les hache avec `bcrypt.hash()` en utilisant un "sel" de 10.
//    - Une fois le mot de passe haché, elle crée un nouvel utilisateur avec le modèle `User`
// et enregistre l'utilisateur dans la base de données.
//    - Si l'enregistrement réussit, elle renvoie un statut 201 et un message indiquant
// que l'utilisateur a été créé.
//    - Si une erreur survient, elle renvoie un statut 500 et l'objet d'erreur.

// 3. La fonction `login` permet de connecter un utilisateur :
//    - Elle recherche un utilisateur avec l'email fourni dans la base de données en utilisant
// `User.findOne()`.
//    - Si l'utilisateur n'est pas trouvé, elle renvoie un statut 401 avec un message d'erreur
// indiquant que la paire identifiant et mot de passe est incorrecte.
//    - Si l'utilisateur est trouvé, elle utilise `bcrypt.compare()` pour comparer le mot de passe
// fourni avec le mot de passe haché stocké dans la base de données.
//    - Si la comparaison échoue, elle renvoie un statut 401 avec un message d'erreur
// similaire à celui de l'étape précédente.
//    - Si la comparaison réussit, elle crée un JWT en utilisant l'ID de l'utilisateur
// comme payload, avec une clé secrète et une durée de validité de 24 heures.
//    - Elle renvoie ensuite un statut 200 avec l'ID de l'utilisateur et le JWT créé.

// Ce contrôleur peut être utilisé dans une application Node.js avec un routeur Express
// pour gérer les routes d'inscription et de connexion des utilisateurs.
