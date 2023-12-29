import { Router } from "express";
import { CartManagerDB } from "../dao/dbManagers/cartManagerDB.js";



const router = Router();
const cartManagerMongo = new CartManagerDB();


//GET
router.get(`/`, async (req,res) =>{

    const carts = await cartManagerMongo.getCarts();

    res.send({
        status: "success",
        carritos: carts 
    })
});

router.get(`/:cid`, async (req,res) =>{
  try{

    const cid = req.params.cid;
    const products = cart.products;
    const cart = await cartManagerMongo.getCart(cid);

    if (!cart) {
        res.status(404).send({
          status: "error",
          msg: "CARRITO NOT FOUND",
        });
        return;
    }

    res.render("cart", { products });

  } catch (error) {
    console.log(error);

    res.status(500).send({ 
      status: "error", 
      msg: "Error al obtener el carrito" 
    });
  }
    res.send({
      status: "success",
      msg: `Ruta GET ID CART con ID: ${cid}`,
    })
});

//POST
router.post(`/`, async (req,res) =>{

    const cart = await cartManagerMongo.createCart();

    res.send({
        status: "success",
        msg: cart
    })
});

router.post(`/:cid/product/:pid`, async (req,res) =>{
    
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    const cart = await cartManagerMongo.addProductToCart(cid, pid, quantity);

    if (!cart) {
        res.status(404).send({
          status: "error",
          msg: "CARRITO NOT FOUND",
        });
        return;
    }

    res.send({
        status: "success",
        msg: `Ruta POST CART - AGREGAR PRODUCTO - CID: ${cid}, PID: ${pid}`,
        carrito: cart,
    })
});


//PUT
router.put(`/:cid`, async (req, res) => {
    try {
      const cid = req.params.cid;
      const products = req.body.products;
      const productModel = await cartManagerMongo.findById(products.id);
      const cart = await cartManagerMongo.findById(cid);
  
      if (!cart) {
        res.status(404).send({ 
            status: "error", 
            msg: "Carrito no encontrado" });
        return;
    }
    products.forEach((products) => {
        if (!productModel) {
            res.send({ 
                status: "error", 
                msg: "No encontrado" 
            });
        }
    });
  
    cart.products = products;
  
    await cart.save();

    res.send({ 
        status: "success", 
        msg: "Carrito actualizado correctamente" 
    });

    } catch (error) {
      console.log(error);

      res.status(500).send({ 
         status: "error", 
         msg: "Error al actualizar carrito"
        });
    }
});
  
router.put(`/:cid/products/:pid`, async (req, res) => {
    try {
  
      const cid = req.params.cid;
      const pid = req.params.pid;
      const quantity = req.body.quantity;
  
      const cart = await productManagerDB.findById(cid);
  
      if (!cart) {
        res.status(404).send({ 
          status: "error", 
          msg: "Carrito no encontrado" 
        });
        return;
      }
  
      const product = await productManagerDB.findById(pid);
  
      if (!product) {
        res.status(404).send({ 
          status: "error", 
          msg: "Producto no encontrado" 
        });
        return;
      }
  
      const index = cart.products.findIndex((p) => p.id === pid);
  
      if (index === -1) {
        res.status(404).send({ 
          status: "error", 
          msg: "Producto no encontrado en el carrito" 
        });
        return;
      }
  
      cart.products[index].quantity = quantity;
  
      await cart.save();
  
      res.send({ 
         status: "success", 
         msg: "Cantidad de producto actualizada correctamente" 
        });
  
    } catch (error) {
      console.log(error);
  
      res.status(500).send({ 
         status: "error", 
         msg: "Error al actualizar cantidad de producto" 
        });
    }
});

//DELETE
router.delete(`/:cid`, async (req, res) => {
    try {

      const cid = req.params.cid;
  
      const cart = await cartManagerMongo.findById(cid);
  
      if (!cart) {
        res.status(404).send({ 
            status: "error", 
            msg: "Carrito no encontrado" 
        });
        return;
      }
      //Se vacia el carrio
      cart.products = [];
  
      await cart.save();
  
      res.send({ 
         status: "success", 
         msg: "Carrito vaciado correctamente" 
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({ 
         status: "error", 
         msg: "Error al vaciar carrito" 
        });
    }
});

router.delete(`/:cid/products/:pid`, async (req, res) => {
    try {

      const cid = req.params.cid;
      const pid = req.params.pid;
  
      const cart = await cartManagerMongo.findById(cid);
  
      if (!cart) {
        res.status(404).send({
             status: "error", 
             msg: "Carrito no encontrado"
            });
        return;
      }
  
      const product = await cartManagerMongo.findById(pid);
  
      if (!product) {
        res.status(404).send({ 
            status: "error", 
            msg: "Producto no encontrado" 
        });
        return;
      }
  
      const index = cart.products.findIndex((p) => p.id === pid);
  
      if (index === -1) {
        res.status(404).send({ 
            status: "error", 
            msg: "Producto no encontrado en el carrito" 
        });
        return;
      }
  
      cart.products.splice(index, 1);
  
      await cart.save();
  
      res.send({ 
         status: "success", 
         msg: "Producto eliminado correctamente" 
        }); 

    } catch (error) {
      console.log(error); 

      res.status(500).send({ 
         status: "error", 
         msg: "Error al eliminar producto del carrito" 
        });
    }
});


  
export {router as cartRouter};