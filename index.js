const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const Song = require("./models/songs");

require('dotenv').config();

app.set("view engine", "ejs");

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// const songs = [
//     {
//         id: 1,
//         cover: "https://upload.wikimedia.org/wikipedia/pt/0/00/Sawayama.jpg",
//         title: "XS",
//         artist: "Rina Sawayama",
//         album: "Sawayama"
//     },
// ];

var message = "";

/* Renderiza a página inicial */
app.get("/", async (req, res) => {
    const songs = await Song.findAll();

    res.render("index", { pageTitle: "JOYMUSIC | Home", songs, message });
});

/* Renderiza a página de cadastrar música */
app.get("/cadastro", (req, res) => {
    res.render("cadastro", { pageTitle: "Joymusic | Cadastro de Música" });
});

app.get("/detalhes/:id", async (req, res) => {
    const songs = await Song.findByPk(req.params.id);
    res.render("detalhes", { pageTitle: "Joymusic | Informações da Música", songs });
  });

  app.post("/new", async (req, res) => {
    const { cover, title, artist, album } = req.body;

    try {
      await Song.create({
        cover, 
        title, 
        artist, 
        album
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

/* Rota para deletar tudo */
app.delete("/apagar", (req, res) => {
    res.send('[HTTP200] Todas as músicas foram deletadas');
    res.redirect("/");
});

/* Rota para deletar apenas uma música*/
app.delete("/apagar/:id", (req, res) => {
    const { id } = req.params;
    const songsIndex = songs.findIndex(i => i.id == id);
    songs.splice(songsIndex, 1);
   
    return res.send("Deletado com sucesso");
});

/* Rota para alterar apenas uma música */
app.get("/update/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);

  if (!songs) {
    res.render("index", {
      message: "Música não encontrado!",
    });
  }
  
  res.render("update", { pageTitle: "Joymusic | Edite a Música", songs });
});

app.post("/update/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);

  const { cover, title, artist, album } = req.body;

  songs.cover = cover;
  songs.title = title;
  songs.artist = artist;
  songs.album = album;

  const updatedSong = await songs.save();
  
  res.render("update", { pageTitle: "Joymusic | Home", songs: updatedSong, message: "Sucesso ao editar a música!" });
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));

