import productsModel from "../models/product.model.js";

//falta completar metdods

class ProductManagerDB {
   
    getProducts = async (options) => {
        
        const products = await productsModel.paginate(
            {},

            //falta hacer el filter aun
            {
                options
            }
        );
        return products
    }

    getProductById = async (pid) => {
        
        const products = await productsModel.findOne({_id:id});
        return {
            status: "success",
            msg: products
        }
    }
}

export { ProductManagerDB };