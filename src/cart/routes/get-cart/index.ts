import { Request, Response } from 'express';
import { CartService } from '../../service/cart.service';

export const getCartRoute = (cartService: CartService) => {
  return (req: Request, res: Response) => {
    const { cartId } = req.params;

    const cart = cartService.getCart(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const items = cart.getItems();
    const total = cart.calculateTotal().total;

    res.status(200).json({ items, total });
  };
};
