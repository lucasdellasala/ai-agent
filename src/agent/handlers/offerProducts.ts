import { productsDB } from '../data/mockDB';
import { IProductOffer, IProduct } from '../context/context';

export function handleOfferProducts(products: string[] | undefined): IProductOffer {
  if (products && products.length > 0) {
    const requested = products.map((p) => p.toLowerCase());
    const matched = productsDB.filter((p) => requested.includes(p.name.toLowerCase()));

    if (matched.length > 0) {
      return {
        products: matched.map((p) => ({ productName: p.name, available: p.stock > 0 })),
      };
    }
  }

  // Return all products when none specified (demo purposes only)
  const allProducts: IProduct[] = productsDB.map((p) => ({
    productName: p.name,
    available: p.stock > 0,
  }));

  return { products: allProducts };
}
