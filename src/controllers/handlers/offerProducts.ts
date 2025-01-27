import { productsDB } from "../../data/mockDB";
import { IProductOffer, IProduct } from "../../context/context";

export function handleOfferProducts(products: Array<string> | undefined): IProductOffer {
  if (products && products.length > 0) {
    const productsRequested = products.map((p) => p.toLowerCase());
    const productsInDB = productsDB.filter((p) =>
      productsRequested.includes(p.name.toLowerCase())
    );

    if (productsInDB.length > 0) {
      return {
        products: productsInDB.map((p) => ({
          productName: p.name,
          available: p.stock > 0,
        })),
      };
    }
  }

  // Si no hay un producto solicitado, se devuelven todos los productos.
  // Esto es solo para el propósito de este ejercicio. No sería eficiente hacerlo en producción.
  const allProducts: Array<IProduct> = productsDB.map((p) => ({
    productName: p.name,
    available: p.stock > 0,
  }));

  return { products: allProducts };
}
