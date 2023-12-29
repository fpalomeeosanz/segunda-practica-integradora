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

    const cid = parseInt(req.params.cid);
    const cart = await cartManagerFile.getCart(cid);

    if (!cart) {
        res.status(404).send({
          status: "error",
          msg: "CARRITO NOT FOUND",
        });
        return;
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
router.put(`/:cid`, async (req,res) =>{

    const cid = parseInt(req.params.cid);
    const updatedCart = req.body;
    const cart = await cartManagerFile.getCart(cid);

    if (!cart) {
        res.status(404).send({
          status: "error",
          msg: "Cart not found",
        });
        return;
    }

    cart.products = updatedCart.products;

    await cartManagerFile.updateCart(cart);

    res.send({
        status: "succes",
        msg: `Ruta PUT de CART con ID: ${cid}`,
        carrito: cart,
    })
});

//DELETE
router.delete(`/:cid`, async (req, res) => {
    try {

      const cid = req.params.cid;
  
      const cart = await cartManagerMongo.findById(cid);
  
      if (!cart) {
        res.status(404).json({
            status: "error", 
            msg: "Carrito no encontrado" 
        });
        return;
      }
  
      cart.products = [];
  
      await cart.save();
  
      res.send({ 
         status: "success",
         msg: "Carrito vaciado correctamente"
        });
        
    } catch (error) {
      console.log(error);
      res.status(500).json({
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
  
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", msg: "Error al eliminar producto del carrito" });
    }
  });
  

export {router as cartRouter};