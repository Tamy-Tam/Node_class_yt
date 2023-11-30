console.log("Hello Node, 😄");

const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const { success, getUniqueId } = require("./helper.js");
const PokemonModel = require("./src/models/pokemon");
let pokemons = require("./src/db/mock-pokemon.js");

const app = express();
const port = 3000;

const sequelize = new Sequelize("pokedex", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  dialiectOptions: {
    timezone: "Etc/GMT-2",
  },
  logging: false,
});

sequelize
  .authenticate()
  .then((_) =>
    console.log("La connection à la base de données a bien été établie.")
  )
  .catch((error) =>
    console.error(`Impossible de se connecter à la base de données ${error}`)
  );

const Pokemon = PokemonModel(sequelize, DataTypes);

sequelize.sync({ force: true }).then((_) => {
  console.log('La base de données "Pokedex" a bien été syncronisée');

  pokemons.map((pokemon) => {
    Pokemon.create({
      name: pokemon.name,
      hp: pokemon.hp,
      cp: pokemon.cp,
      picture: pokemon.picture,
      types: pokemon.types.join(),
    }).then((thePokemon) => console.log(thePokemon.toJSON()));
  });
});

app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());
/*app.use((req, res, next) => {
    console.log(`URL: ${req.url}`)
    next()
})
*/

app.get("/", (req, res) => res.send("Hello, Express! 👋"));

app.get("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemons.find((pokemon) => pokemon.id === id);
  const message = "Un pokémon a bien été trouvée!";
  // res.send(`Vous avez demandé le pokemon ${pokemon.name}`)
  //res.json(pokemon)
  //res.json(helper.success(message, pokemon))
  res.json(success(message, pokemon));
});
app.get("/api/pokemons", (req, res) => {
  const total = pokemons.length;
  //res.send(`Il y a ${total} pokemon${total < 2 ? '' : 's'} dans le pokédex pour le moment.`)
  const message = "La liste des pokemons a bien été récupérée!";
  res.json(success(message, pokemons));
});

app.post("/api/pokemons", (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } };
  pokemons.push(pokemonCreated);
  const message = `Le pokemon ${pokemonCreated.name} a bien été créé`;
  res.json(success(message, pokemonCreated));
});

app.put("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonUpdated = { ...req.body, id: id };
  pokemons = pokemons.map((pokemon) => {
    return pokemon.id === id ? pokemonUpdated : pokemon;
  });

  const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`;
  res.json(success(message, pokemonUpdated));
});

app.delete("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonDeleted = pokemons.find((pokemon) => pokemon.id === id);
  pokemons = pokemons.filter((pokemon) => pokemon.id !== id);
  const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`;
  res.json(success(message, pokemonDeleted));
});

app.listen(port, () =>
  console.log(
    `Notre application Node est démarrée sur : http://localhost:${port}`
  )
);
