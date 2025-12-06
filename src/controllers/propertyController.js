import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const createProperty = async (req, res) => {
  const result = await getDB().collection("properties").insertOne(req.body);
  res.send(result);
};

export const getProperties = async (req, res) => {
  const properties = await getDB().collection("properties").find().toArray();
  res.send(properties);
};

export const getSingleProperty = async (req, res) => {
  const property = await getDB()
    .collection("properties")
    .findOne({ _id: new ObjectId(req.params.id) });
  res.send(property);
};
