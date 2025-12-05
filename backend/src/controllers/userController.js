import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const createUser = async (req, res) => {
  const result = await getDB().collection("users").insertOne(req.body);
  res.send(result);
};

export const getUsers = async (req, res) => {
  const users = await getDB().collection("users").find().toArray();
  res.send(users);
};

export const getUser = async (req, res) => {
  const user = await getDB()
    .collection("users")
    .findOne({ _id: new ObjectId(req.params.id) });
  res.send(user);
};
