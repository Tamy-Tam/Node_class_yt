// Step 1 : "Hello, Heroku ! 👋"
fetch("https://calm-ruby-duck-vest.cyclic.app/")
  .then((res) => res.json())
  .then((res) => console.log(res));

// Step 2 : "Get JWT token 🔓"
fetch("https://calm-ruby-duck-vest.cyclic.app/api/login", {
  method: "POST",
  body: JSON.stringify({ username: "pika", password: "pikachu" }),
  headers: { "Content-type": "application/json" },
})
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    return res.token;
  })
  .then((token) => fetchPokemonlist(token));

// Step 3 : "Get pokemon list 🎉"
const fetchPokemonlist = (token) => {
  fetch("https://calm-ruby-duck-vest.cyclic.app/api/pokemons", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
};
