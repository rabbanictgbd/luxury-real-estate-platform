import { getDB } from "../config/db.js";

export const savePayment = async (req, res) => {
  const result = await getDB().collection("payments").insertOne(req.body);
  res.send(result);
};
