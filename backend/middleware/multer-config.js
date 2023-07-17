// Appel du plugin multer
const multer = require("multer");

// Définition des types de MIMES acceptés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Destination du stockage des images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // création d'un nom de fochier image unique et remplacement par des "_"
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Export de l'élément multer entièrement configuré (destination de stockage + images acceptées).
module.exports = multer({ storage: storage }).single("image");

// Ce code est destiné à gérer le téléchargement et le stockage des fichiers image
// sur un serveur en utilisant le plugin "multer" pour Node.js. Voici une explication
// détaillée de chaque partie du code :

// 1. Importation de multer :
// ```javascript
// const multer = require('multer');
// ```
// Cette ligne importe le module "multer" de Node.js et le stocke dans la constante "multer".

// 2. Définition des types MIME :
// ```javascript
// const MIME_TYPES = {
//   'image/jpg': 'jpg',
//   'image/jpeg': 'jpg',
//   'image/png': 'png'
// };
// ```
// Un objet MIME_TYPES est créé pour définir les types MIME acceptés pour les images.
// Les types MIME sont utilisés pour déterminer le type de fichier et ainsi s'assurer
// que seuls les fichiers image sont téléchargés.

// 3. Configuration de la destination de stockage :
// ```javascript
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'images');
//   },
//   filename: (req, file, callback) => {
// création d'un nom de fochier image unique et remplacement par des "_"
//     const name = file.originalname.split(' ').join('_');
//     const extension = MIME_TYPES[file.mimetype];
//     callback(null, name + Date.now() + '.' + extension);
//   }
// });
// ```
// Ici, nous configurons la destination de stockage des fichiers téléchargés.
// "multer.diskStorage()" est utilisé pour définir la destination et le nom du fichier.

// - `destination`: La destination est définie comme un dossier nommé "images".
// Lorsque les images sont téléchargées, elles sont stockées dans ce dossier.
// - `filename`: La fonction "filename" génère un nom de fichier unique pour chaque image
// téléchargée. Le nom d'origine du fichier est modifié en remplaçant les espaces par
// des underscores (_). La date actuelle (Date.now()) est ajoutée pour assurer l'unicité
// du nom du fichier, et l'extension est ajoutée à partir des types MIME définis précédemment.

// 4. Exportation de multer configuré :
// ```javascript
// module.exports = multer({storage: storage}).single('image');
// ```
// Enfin, nous exportons l'instance de multer configurée avec les paramètres de stockage
// définis précédemment. La méthode "single()" spécifie que nous ne gérons qu'un seul fichier
// à la fois, nommé "image".
