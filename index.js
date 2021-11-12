const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const songs = [
    {
        id: 1,
        cover: "https://upload.wikimedia.org/wikipedia/pt/0/00/Sawayama.jpg",
        title: "XS",
        artist: "Rina Sawayama",
        album: "Sawayama"
    },
];
var message = "";

/* Renderiza a página inicial */
app.get("/", (req, res) => {
    res.render("index", { pageTitle: "Joymusic | Home", songsList: songs, message });
});

/* Renderiza a página de cadastrar música */
app.get("/cadastro", (req, res) => {
    res.render("register", { titulo: "Joymusic | Cadastro de Música" });
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
app.put("/update/:id", (req, res) => {
    res.send();
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));

