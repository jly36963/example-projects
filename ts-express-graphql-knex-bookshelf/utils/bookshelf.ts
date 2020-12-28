import knex from "../connections/postgres";
import Bookshelf from "bookshelf";

const bookshelf = Bookshelf(knex);

export default bookshelf;
