import { db } from "../connection.js";

const productModel = db.collection("products");
export default productModel;
