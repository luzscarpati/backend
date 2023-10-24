import fs from "fs";
import crypto from "crypto";

export class ProductManager {
    #productIdCounter = 1;
    constructor() {
        this.products = [];
        this.productsPath = './products.json';
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.productsPath)) {
                const productsJSON = await fs.promises.readFile(this.productsPath, 'utf-8');
                return JSON.parse(productsJSON);
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: this.#productIdCounter++,
        };
        try {
            if(!product.title ||
                !product.description ||
                !product.price ||
                !product.thumbnail ||
                !product.code ||
                !product.stock) {
                    console.log("Todos los campos son obligatorios")
                }else {
                    this.products.push(product); 
                    await fs.promises.writeFile(this.productsPath, JSON.stringify(this.products));
                }
        } catch (error) {
            console.log ("Error al agregar el producto", error);
        }
    }   

    async getProductById(id) {
        try {
          const products = await this.getProducts();
          const product = products.find((p) => p.id === id);
          return product || null;
        } catch (error) {
          console.error("Error al buscar el producto por ID:", error);
          return null;
        }
      }
      

    async updateProduct(id, updatedFields) {
        try {
            const productIndex = this.products.findIndex((p) => p.id === id);
            if (productIndex !== -1) {
                updatedFields.id = id;
                this.products[productIndex] = updatedFields;
                await fs.promises.writeFile(this.productsPath, JSON.stringify(this.products));
                console.log("Producto actualizado correctamente.");
            } else {
                console.log("Producto no encontrado. No se pudo actualizar.");
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }
    
    async deleteProduct(id) {
        try {
            const productIndex = this.products.findIndex((p) => p.id === id);
            if (productIndex !== -1) {
                this.products.splice(productIndex, 1);
                await fs.promises.writeFile(this.productsPath, JSON.stringify(this.products));
                console.log("Producto eliminado correctamente.");
            } else {
                console.log("Producto no encontrado. No se pudo eliminar.");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }
    
    
}

const productManager = new ProductManager();

// Ejemplo de uso
const test = async () => {
    console.log('Productos existentes:', await productManager.getProducts());

    productManager.addProduct('Producto1', 'Descripción del Producto 1', 19.99, 'image1.jpg', 'P0001', 30);
    productManager.addProduct('Producto2', 'Descripción del Producto 2', 24.99, 'image2.jpg', 'P0002', 20);
    productManager.addProduct('Producto3', 'Descripción del Producto 3', 14.99, 'image3.jpg', 'P0003', 40);
    productManager.addProduct('Producto4', 'Descripción del Producto 4', 29.99, 'image4.jpg', 'P0004', 15);
    // Agregar producto con parámetro faltante
    productManager.addProduct('Producto5', 'Descripción del Producto 3', 14.99, 'image3.jpg', 'P0003');

    // Buscar un producto por id (ejemplo de búsqueda exitosa)
    productManager.getProductById(1);
    // Buscar un producto por id (ejemplo de producto no encontrado)
    productManager.getProductById(5);

    console.log('Productos después de agregar varios:', await productManager.getProducts());

    // Prueba de updateProduct
    const updatedProduct = {
        title: 'Producto1 Actualizado',
        description: 'Descripción Actualizada',
        price: 24.99,
        thumbnail: 'image-updated.jpg',
        code: 'P0001-Updated',
        stock: 40,
    };

    productManager.updateProduct(1, updatedProduct);
    console.log('Productos después de actualizar:', await productManager.getProducts());

    // Prueba de deleteProduct
    productManager.deleteProduct(2);
    console.log('Productos después de eliminar:', await productManager.getProducts());
};

//test();



