import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function openDatabase() {
  return open({
    filename: "altsebtid.db",
    driver: sqlite3.Database,
  });
}

export async function connectDatabase() {
  const db = await openDatabase();
  return db;
}

export async function getArticles() {
  const db = await connectDatabase();
  const data = await db.all("SELECT * FROM article");
  return data;
}