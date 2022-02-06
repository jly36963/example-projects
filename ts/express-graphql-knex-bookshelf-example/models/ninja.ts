import bookshelf from "../utils/bookshelf";

const Ninja = bookshelf.model("Ninja", {
  tableName: "ninjas",
  jutsus() {
    return this.belongsToMany("Jutsu", "ninjas_jutsus", "ninja_id", "jutsu_id");
  },
});

export default Ninja;
