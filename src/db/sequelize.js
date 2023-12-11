/* L’API Rest et la Base de données : Créer un modèle Sequelize */
const { Sequelize, DataTypes } = require("sequelize");
const PokemonModel = require("../models/pokemon");
const UserModel = require("../models/user");
const pokemons = require("./mock-pokemon");
const bcrypt = require("bcrypt");

let sequelize;

if (process.env.NODE_ENV == "production") {
  //Database, username, password
  sequelize = new Sequelize(
    "s23guadtms4meatm",
    "ecd3wntlk6r8x307",
    "q6lenkbg2fjcojv3",
    {
      host: "cxmgkzhk95kfgbq4.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      dialect: "mariadb",
      dialectOptions: {
        timezone: "Etc/GMT-2",
      },
      logging: false,
    }
  );
} else {
  sequelize = new Sequelize("pokedex", "root", "", {
    host: "localhost",
    dialect: "mariadb",
    dialectOptions: {
      timezone: "Etc/GMT-2",
    },
    logging: false,
  });
}

const Pokemon = PokemonModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

const initDb = () => {
  return sequelize
    .sync({ force: process.env.NODE_ENV == "production" ? false : true })
    .then((_) => {
      console.log("INIT DB");
      pokemons.map((pokemon) => {
        Pokemon.create({
          name: pokemon.name,
          hp: pokemon.hp,
          cp: pokemon.cp,
          picture: pokemon.picture,
          types: pokemon.types,
        }).then((pokemon) => console.log(pokemon.toJSON()));
      });

      bcrypt
        .hash("pikachu", 10)
        .then((hash) => User.create({ username: "pika", password: hash }))
        .then((user) => console.log(user.toJSON()));

      console.log("La base de donnée a bien été initialisée !");
    });
};

module.exports = {
  initDb,
  Pokemon,
  User,
};
