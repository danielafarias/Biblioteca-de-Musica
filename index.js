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
var loading = false;

/* GET HOME PAGE */
app.get("/", async (req, res) => {
  const songs = await Song.findAll();

  if (songs == "") {
    res.render("index", {
      pageTitle: "JOYMUSIC | Home",
      songs,
      message: "",
      loading: true,
    });
  }

  res.render("index", {
    pageTitle: "JOYMUSIC | Home",
    songs,
    message: "",
    loading,
  });
});

/* GET CADASTRO */
app.get("/cadastro", async (req, res) => {
  const genders = await Gender.findAll();

  if (genders == "") {
    res.render("cadastro", {
      pageTitle: "Joymusic | Cadastro de Música",
      genders,
      message: "Gêneros não encontrados",
    });
  }

  res.render("cadastro", {
    pageTitle: "Joymusic | Cadastro de Música",
    genders,
    message: "",
  });
});

/* POST CADASTRO */
app.post("/new", async (req, res) => {
  const { cover, title, artist, album, gender_id } = req.body;

  try {
    await Song.create({
      cover,
      title,
      artist,
      album,
      gender_id,
    });

    message = "A música foi cadastrada com sucesso!";

    res.redirect("/");
  } catch (err) {
    console.log(err);

    res.render("cadastro", {
      pageTitle: "Joymusic | Cadastro de Música",
      message: "Erro ao cadastrar a música.",
    });
  }
});

/* GET DETALHES */
app.get("/detalhes/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);

  try {
    const songTitle = songs.title;
    const songArtist = songs.artist;
    const songAlbum = songs.album;

    const normalizeTitle = songTitle
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const normalizeArtist = songArtist
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const normalizeAlbum = songAlbum
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const params = {
      method: "GET",
      url:
        "https://api.deezer.com/search/track?q=" +
        normalizeTitle +
        "+" +
        normalizeArtist +
        "+" +
        normalizeAlbum,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios(params);

    const responseData = response.data.data;

    const responseArray = Array.from(responseData);

    const filteredArray = responseArray.filter(
      (x) =>
        x.title_short.toLowerCase() == songTitle.toLowerCase() &&
        x.artist.name.toLowerCase() == songArtist.toLowerCase()
    );
   
    res.render("detalhes", {
      pageTitle: "Joymusic | Informações da Música",
      songs,
      filteredArray,
    });
  } catch (err) {
    message = "Música não encontrada.";
    res.redirect("/");
  }
});

/* GET ALTERAR */
app.get("/update/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);
  const genders = await Gender.findAll();

  console.log(songs);

  if (!songs) {
    message = "Música não encontrada.";
    res.redirect("/");
  }

  res.render("update", {
    pageTitle: "Joymusic | Edite a Música",
    songs,
    genders,
  });
});

/* POST ALTERAR  */
app.post("/update/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);

  const { cover, title, artist, album } = req.body;

  songs.cover = cover;
  songs.title = title;
  songs.artist = artist;
  songs.album = album;

  try {
    await songs.save();
    message = "Música foi alterada com sucesso.";
    res.redirect("/");
  } catch (err) {
    message = "Erro ao alterar a música.";
    res.redirect("/");
  }
});

/* GET DELETE */
app.get("/deletar/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);

  if (!songs) {
    message = "Música não encontrada.";
    res.redirect("/");
  }

  res.render("deletar", {
    pageTitle: "Joymusic | Apagar Música",
    songs,
  });
});

/* POST DELETE */
app.post("/deletar/:id", async (req, res) => {
  const songs = await Song.findByPk(req.params.id);
  try {
    await songs.destroy();

    message = "A música foi deletada com sucesso!";
    res.redirect("/");
  } catch (err) {
    message = "Ocorreu um erro ao deletar a música.";
    res.redirect("/");
  }
});

/* GET GENEROS */
app.get("/generos", async (req, res) => {
  const genders = await Gender.findAll();

  if (!genders) {
    res.render("generos", {
      pageTitle: "Joymusic | Lista de Gêneros",
      loading: true,
    });
  }

  res.render("generos", {
    pageTitle: "Joymusic | Lista de Gêneros",
    genders,
    loading,
  });
});

/* GET GENERO */
app.get("/genero/:id", async (req, res) => {
  try {
    const genders = await Gender.findByPk(req.params.id);

    const songs = await Song.findAll({
      where: {
        gender_id: genders.id,
      },
    });

    if (!songs) {
      res.render("genero", {
        pageTitle: "Joymusic | Gênero",
        genders,
        loading: true,
      });
    }

    res.render("genero", {
      pageTitle: "Joymusic | Gênero",
      genders,
      songs,
      loading,
    });
  } catch (err) {
    message = "Gênero não encontrado.";
    res.redirect("/");
  }
});

/* POST SEARCH  */
app.post("/buscar", async (req, res) => {
  const { musica } = req.body;

  const song = await Song.findAll();

  const songs = song.filter(
    (v) =>
      v.title.toLowerCase().includes(musica.toLowerCase()) 
  );

  if (!songs) {
    loading = true;
  }

  // const Op = Sequelize.Op;
  // const songs = await Song.findAll({
  //   where: {
  //     title: {
  //       [Op.like]:
  //         "%" + musica.toLowerCase() + "%" && "%" + musica.toUpperCase() + "%" && "%" + musica + "%",
  //     },
  //   },
  // });


  res.render("index", {
    pageTitle: "JOYMUSIC | Home",
    songs,
    message: "",
    loading,
  });
});

app.get ("/sobre", (req, res) => {
  res.render ("sobre", {
    pageTitle: "JOYMUSIC | Os Alunos",
  });
});

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
