import { Request, Response } from 'express';
import { CartService } from '../../service/cart.service';

export const deleteCartItemRoute = (cartService: CartService) => {
  return (req: Request, res: Response) => {
    const { cartId, itemId } = req.params;

    const result = cartService.removeProductFromCart(cartId, itemId);

    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.status(204).send();
  };
};
