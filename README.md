# Examen – TDD

## Questions

### Partie 1 – Compréhension rapide (15 points)

**1.** En une ou deux phrases, expliquez le principe du TDD et ses trois étapes clés. *(5 pts)*

Le TDD (Test Driven Development) consiste à écrire les tests avant le code de production. Les trois étapes clés sont : **Red** (écrire un test qui échoue), **Green** (écrire le code minimal pour faire passer le test), **Refactor** (améliorer le code sans casser les tests).

**2.** Citez deux avantages concrets du TDD. *(5 pts)*

- **Meilleure qualité du code** : Les tests permettent de détecter les bugs plus tôt et garantissent que le code répond aux exigences.
- **Documentation vivante** : Les tests servent de documentation à jour qui décrit le comportement attendu du système.

**3.** Quelle est la différence entre un fake et un stub ? Donnez un exemple rapide. *(5 pts)*

Un **stub** retourne des réponses préprogrammées (ex: une méthode `getUser()` qui retourne toujours `{ id: 1, name: "Test" }`).
Un **fake** a une implémentation fonctionnelle mais simplifiée (ex: une base de données en mémoire qui simule une vraie DB sans persister les données).

### Partie 2 – Cas pratique : gestion de panier e-commerce (85 points)

## Fonctionnalités

- Ajout de produits (nom + prix)
- Calcul du total du panier
- Réduction de 10% si le total dépasse 100€
- Gestion de l'état du panier

## Endpoints

### `GET /products`
Récupère tous les produits disponibles.
- **Response**: `{ products: Product[] }`

### `GET /carts/:cartId`
Récupère le panier complet.
- **Response**: `{ items: CartItem[], total: number }`

### `GET /carts/:cartId/total`
Calcule le total du panier avec réduction si applicable.
- **Response**: `{ preTotal: number, discount: number, total: number }`

### `PATCH /carts/:cartId`
Ajoute un élément au panier.
- **Body**: `{ productId: string, quantity: number }`
- **Response**: `200 OK`

### `DELETE /carts/:cartId`
Supprime tout le contenu du panier.
- **Response**: `204 No Content`

### `GET /carts/:cartId/items/:itemId`
Récupère un article spécifique du panier.
- **Response**: `{ item: CartItem }`

### `PATCH /carts/:cartId/items/:itemId`
Modifie la quantité d'un article du panier.
- **Body**: `{ quantity: number }`
- **Response**: `200 OK`

### `DELETE /carts/:cartId/items/:itemId`
Supprime un article du panier.
- **Response**: `204 No Content`

## Projet

```bash
pnpm install # Installer les dépendances

pnpm test    # Exécuter les tests
pnpm dev     # Lancer le serveur de dev
```
