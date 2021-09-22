import bookshelf from "../utils/bookshelf";

const Jutsu = bookshelf.model("Jutsu", {
  tableName: "jutsus",
  ninjas() {
    return this.belongsToMany("Ninja", "ninjas_jutsus", "jutsu_id", "ninja_id");
  },
});

export default Jutsu;
