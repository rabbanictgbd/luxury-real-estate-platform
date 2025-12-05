import { getDB } from "../config/db.js";

export const createCategory = async (req, res) => {
  const result = await getDB().collection("categories").insertOne(req.body);
  res.send(result);
};

export const getCategories = async (req, res) => {
  const categories = await getDB().collection("categories").find().toArray();
  res.send(categories);
};
