import cartsModel from "../models/cart.model.js";
import productsModel from "../models/product.model.js";

class CartManagerDB {

    getCarts = async () => {
        const carts = await cartsModel.find()
        return carts;
    }

    getCartById = async (cid) => {
        const cart = await cartsModel.find({_id:cid})
        return cart;
    }

    createCart= async () => {
        const cart = await cartsModel.create();
        return cart;
    }

    addProductToCart= async (cid, pid, quantity = 1) => {
        const cart = await cartsModel.findOne({_id:cid});
        if (!cart){
            return{
                status: "error",
                msg: `El carrito ${cid} no existe`
            }
        };

        const product = await productsModel.findOne({_id:pid});
        if (!product){
            return{
                status: "error",
                msg: `El producto ${pid} no existe`
            }
        };

        let productToCart = cart.product;

        const indexProduct = productToCart.findIndex((product) => product.product == pid);

        if(indexProduct == -1){
            const newProduct = {
                product: pid,
                quantity: quantity
            }
            cart.product.push(newProduct);
        } else {
            cart.product[indexProduct].quantity += quantity;
        }
        await cart.save();
        
        return cart;
    }
}

export { CartManagerDB }