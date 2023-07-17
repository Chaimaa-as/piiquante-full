const Sauce = require("../models/sauceModel");

// pour spprimer un fichier (fs unlink)
const fs = require("fs");

exports.getSauces = (req, res, next) => {
  Sauce.find() // demande à BDD
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(500).json({ error }));
};

exports.createSauces = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  delete req.body._id;
  const sauce = new Sauce({
    ...sauceObj,
    // Img et textes doivent être traités différemment, appelées via leur url
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
  });
  console.log(sauce);

  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // demande à BDD
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(500).json({ error }));
};

exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.manageLike = (req, res) => {
  //on recupere la sauce sur laquelle modifier les likes
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log(sauce);
      //l'utilisateur like la sauce : si si la valeur de like est +1 on ajoute l'id du user connecté dans le tableau des likes
      if (req.body.like == 1) {
        // condition pour que la suppression soit associé à l'id
        sauce.usersLiked.push(req.auth.userId);
      }

      //l'utilisateur dislike la sauce : si la valeur de like est -1 on ajoute l'id du user connecté dans le tableau des dislikes
      else if (req.body.like == -1) {
        sauce.usersDisliked.push(req.auth.userId);
      }

      //si la valeur de like est 0 on supprime l'id du user connecté des deux tableaux
      else if (req.body.like == 0) {
        //Annulation du like : supprimer le like de l'id du user connectéd du tableau des likes.
        if (sauce.usersLiked.includes(req.body.userId)) {
          const userLikedIndex = sauce.usersLiked.indexOf(req.body.userId);
          sauce.usersLiked.splice(userLikedIndex, 1);
        }

        if (sauce.usersDisliked.includes(req.body.userId)) {
          const usersDislikedIndex = sauce.usersDisliked.indexOf(
            req.body.userId
          );
          sauce.usersDisliked.splice(usersDislikedIndex, 1);
        }
      }

      //on met a jour les compteurs de like et dislikes en comptant le nb d'element dans chacun des tableau
      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;

      //on met a jour l'objet dans la base avec les champs qu'on a modifié
      Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

// Ce code est un fichier de contrôleurs pour une application de gestion des sauces.
// Il gère les opérations CRUD (création, lecture, mise à jour, suppression) pour les sauces,
// ainsi que la gestion des likes et des dislikes. Voici un résumé des différentes parties du code :

// 1. Importation des modules nécessaires :
//    - `sauceModel` est importé depuis `../models/sauceModel`. Il s'agit du modèle Mongoose
// pour les objets Sauce.
//    - `fs` (file system) est un module natif de Node.js pour interagir avec le système de fichiers,
//  utilisé ici pour supprimer les fichiers images.

// 2. `exports.getSauces` est une fonction pour récupérer toutes les sauces depuis
// la base de données et les renvoyer au client au format JSON.

// 3. `exports.createSauces` est une fonction pour créer une nouvelle sauce
// et l'enregistrer dans la base de données. Les informations de la sauce sont
// envoyées par le client dans le corps de la requête. L'image de la sauce est traitée
// séparément et stockée dans le dossier `images`.

// 4. `exports.getOneSauce` est une fonction pour récupérer une seule sauce à partir
// de la base de données en utilisant son identifiant (_id) et la renvoyer au client
// au format JSON.

// 5. `exports.updateSauce` est une fonction pour mettre à jour une sauce existante
// dans la base de données. Les informations de la sauce sont envoyées par le client
// dans le corps de la requête. Si une nouvelle image est fournie, l'ancienne image est remplacée.

// 6. `exports.deleteSauce` est une fonction pour supprimer une sauce existante
// de la base de données en utilisant son identifiant (_id). Avant la suppression
// de la sauce, le fichier image associé est également supprimé du dossier `images`.

// 7. `exports.manageLike` est une fonction pour gérer les likes et les dislikes d'une sauce.
// Selon la valeur de `req.body.like` envoyée par le client, l'identifiant de l'utilisateur
// est ajouté ou supprimé des tableaux `usersLiked` et `usersDisliked` de la sauce.
// Les compteurs de likes et de dislikes sont ensuite mis à jour en fonction des modifications
// apportées aux tableaux.
// Notez que ce code utilise des promesses (`.then()` et `.catch()`) pour gérer les opérations
// asynchrones avec la base de données.
