import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const createBooking = async (req, res) => {
  const result = await getDB().collection("bookings").insertOne(req.body);
  res.send(result);
};

export const getUserBookings = async (req, res) => {
  const bookings = await getDB()
    .collection("bookings")
    .find({ userEmail: req.params.email })
    .toArray();

  res.send(bookings);
};
