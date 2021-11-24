## Criação das tabelas e inserção de dados no SQL

#### Para ocorrer tudo sem erros durante a conexão do seu banco e a aplicação, copie e cole o conteúdo a baixo em seu database e rode [F5].

```
CREATE TABLE genders (
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE songs (
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cover TEXT NOT NULL,
    title VARCHAR NOT NULL,
    artist VARCHAR NOT NULL,
	album VARCHAR NOT NULL,
	gender_id INT NOT NULL,
	FOREIGN KEY (gender_id) REFERENCES genders (id)
);

INSERT INTO genders (name) VALUES ('Pop');
INSERT INTO genders (name) VALUES ('Rock');
INSERT INTO genders (name) VALUES ('Folk');
INSERT INTO genders (name) VALUES ('Indie');
INSERT INTO genders (name) VALUES ('R&B');
INSERT INTO genders (name) VALUES ('Hip-hop');
INSERT INTO genders (name) VALUES ('MPB');
INSERT INTO genders (name) VALUES ('Sertanejo');
INSERT INTO genders (name) VALUES ('Forró');
INSERT INTO genders (name) VALUES ('Funk');
INSERT INTO genders (name) VALUES ('Pagode');
INSERT INTO genders (name) VALUES ('Samba');
INSERT INTO genders (name) VALUES ('Jazz');
INSERT INTO genders (name) VALUES ('Blues');
INSERT INTO genders (name) VALUES ('Instrumental');
INSERT INTO genders (name) VALUES ('Eletrônica');
INSERT INTO genders (name) VALUES ('Outros');
```