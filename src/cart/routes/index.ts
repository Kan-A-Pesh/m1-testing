import { Router } from 'express';
import { CartService } from '../service/cart.service';
import { getCartRoute } from './get-cart';
import { getCartTotalRoute } from './get-cart-total';
import { patchCartRoute } from './patch-cart';
import { deleteCartRoute } from './delete-cart';
import { getCartItemRoute } from './get-cart-item';
import { patchCartItemRoute } from './patch-cart-item';
import { deleteCartItemRoute } from './delete-cart-item';

export const createCartRoutes = (cartService: CartService): Router => {
  const router = Router();

  router.get('/carts/:cartId', getCartRoute(cartService));
  router.get('/carts/:cartId/total', getCartTotalRoute(cartService));
  router.patch('/carts/:cartId', patchCartRoute(cartService));
  router.delete('/carts/:cartId', deleteCartRoute(cartService));
  router.get('/carts/:cartId/items/:itemId', getCartItemRoute(cartService));
  router.patch('/carts/:cartId/items/:itemId', patchCartItemRoute(cartService));
  router.delete('/carts/:cartId/items/:itemId', deleteCartItemRoute(cartService));

  return router;
};
