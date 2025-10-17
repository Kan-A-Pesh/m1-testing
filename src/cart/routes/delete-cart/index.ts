import { Request, Response } from 'express';
import { CartService } from '../../service/cart.service';

export const deleteCartRoute = (cartService: CartService) => {
  return (req: Request, res: Response) => {
    const { cartId } = req.params;

    const result = cartService.clearCart(cartId);

    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.status(204).send();
  };
};
