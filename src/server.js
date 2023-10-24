import express from "express";
import { ProductManager } from "./productManager.js"; 
const app = express();
const port = 8080; 

const productManager = new ProductManager();


app.get('/products', async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();

  if (limit) {
    const limitedProducts = products.slice(0, parseInt(limit, 10));
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});


app.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const productId = parseInt(pid);

  const product = await productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});

