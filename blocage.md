Bonjour Alain,

Concrètement, tout fonctionne jusqu’à ce que j’utilise la méthode PATCH pour modifier le mot de passe d’un utilisateur. 
Voici un exemple de document dans ma base MongoDB :

{
  "name": "Benabbou Mac Veigh",
  "firstname": "Tarik",
  "email": "tarik.bmcv@gmail.com",
  "password": "$2b$10$Chu.wyav90yKK1Nd5YOkjOTnVANEH/262G3z8UG801O3hQDo/V1wG",
  "_id": "6860ee819bafec7d009500ac",
  "createdAt": "2025-06-29T07:42:57.593Z",
  "updatedAt": "2025-06-29T07:42:57.593Z",
  "__v": 0
}

Initialement, le mot de passe était "1234".

Avec la méthode PATCH, je le modifie pour "5678", ce qui semble fonctionner, car le champ password est bien mis à jour dans la base (sous forme hachée avec $2b$).

Mais lorsque je teste l’authentification via Postman avec :
méthode POST
URL : localhost:3000/users/authenticate
corps du message dans urlendocded

{
  "email": "tarik.bmcv@gmail.com",
  "password": "5678"
}

J'obtiens systématiquement une erreur "wrong_credentials".

En investiguant dans mon fichier user.services.js (qui, sauf erreur de ma part, correspond bien au controller dans la logique MVC), j’ai remarqué une remarque importante grâce à ChatGPT : lors de l’appel à la méthode PATCH, je réassigne directement user.password = ... sans le hacher manuellement, ce qui empêche la comparaison via bcrypt.compare() de fonctionner.

J’ai tenté d’ajouter cette condition (chatgpt):

if (key === 'password') {
    user[key] = bcrypt.hashSync(temp[key], 10); // ✅ hachage manuel
} else {
    user[key] = temp[key];
}

Mais malgré cela, l’authentification échoue toujours.