const express = require("express");
const path = require("path");
const Song = require("./models/songs");
const Gender = require("./models/genders");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

var message = "";

/* Renderiza a página inicial */
app.get("/", async (req, res) => {
  const songs = await Song.findAll();

  res.render("index", { pageTitle: "JOYMUSIC | Home", songs, message });
});

/* Renderiza a página de cadastrar música */
app.get("/cadastro", async (req, res) => {
  const genders = await Gender.findAll();

  res.render("cadastro", { pageTitle: "Joymusic | Cadastro de Música", genders });
});

/* Renderiza a página de detalhes */
app.get("/detalhes/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);

  const songTitle = songs.title;
  const songArtist = songs.artist;
  const songAlbum = songs.album;

  const params = {
    method: "GET",
    url:
      "https://api.deezer.com/search/track?q=" +
      songTitle +
      "+" +
      songArtist +
      "+" +
      songAlbum,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await axios(params);

  const responseData = response.data.data;

  const responseArray = Array.from(responseData);

  const filteredArray = responseArray.filter(
    (x) => x.title_short.toLowerCase() == songTitle.toLowerCase() && x.artist.name.toLowerCase() == songArtist.toLowerCase()
  );

  res.render("detalhes", {
    pageTitle: "Joymusic | Informações da Música",
    songs,
    filteredArray
  });
});

/* Rota para Post de uma nova música */
app.post("/new", async (req, res) => {
  const { cover, title, artist, album, gender_id } = req.body;

  try {
    await Song.create({
      cover,
      title,
      artist,
      album,
      gender_id
    });

    message = "A música foi cadastrada com sucesso!";
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("cadastro", {
      pageTitle: "Joymusic | Cadastro de Música",
    });
  }
});

/* Renderizar página de alteração */
app.get("/update/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);

  console.log(songs);

  if (!songs) {
    res.render("index", {
      message: "Música não encontrado!",
    });
  }

  res.render("update", { pageTitle: "Joymusic | Edite a Música", songs });
});

/* Rota para alterar a música  */
app.post("/update/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);

  const { cover, title, artist, album } = req.body;

  songs.cover = cover;
  songs.title = title;
  songs.artist = artist;
  songs.album = album;

  await songs.save();

  res.redirect("/");
});

/* Rotas para renderizar a página de confirmação de delete */
app.get("/deletar/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);
  if (!songs) {
    res.render("deletar", {
      pageTitle: "Joymusic | Apagar Música",
      message: "Música não encontrada!",
    });
  }
  res.render("deletar", {
    pageTitle: "Joymusic | Apagar Música",
    songs,
  });
});

/* Rota para deletar a música */
app.post("/deletar/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);
  if (!songs) {
    res.render("deletar", {
      pageTitle: "Joymusic | Apagar Música",
      message: "Música não encontrada!",
    });
  }
  await songs.destroy();
  message = "A música foi deletada com sucesso!";
  res.redirect("/");
});

/* Renderiza a página de lista de generos */
app.get("/generos", async (req, res) => {
  const genders = await Gender.findAll();

  console.log(genders)

  res.render("generos", { pageTitle: "Joymusic | Lista de Gêneros", genders });
});

/* Renderiza a página de lista de generos */
app.get("/genero/:id", async (req, res) => {
  const genders = await Gender.findByPk(req.params.id);
  const songs = await Song.findAll({
    where: {
      gender_id: genders.id
    }
  });

  console.log(songs)

  res.render("genero", { pageTitle: "Joymusic | Gênero", genders, songs });
});

/* Rota para alterar a música  */
app.post("/buscar", async (req, res) => {

  const { musica } = req.body;

  const song = await Song.findAll();

  const songs = song.filter(
    (v) => v.title.includes(musica.toLowerCase()) || v.title.includes(musica.toUpperCase())
  );

  console.log(songs)

  res.render("index", { pageTitle: "JOYMUSIC | Home", songs });
});

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
