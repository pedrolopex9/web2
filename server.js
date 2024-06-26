const express = require('express');
const app = express();
const port = 4000;

const bodyParser = require('body-parser');
const { Pool, Client } = require('pg');

const connectionString = 'postgresql://postgres:123@localhost:5433/postgres';

const client = new Client({
    connectionString: connectionString
});

client.connect();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Adicione isso para suportar JSON

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/form/login.html");
});

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/form/form.html");
});

app.get("/dashboard", (req, res) => { 
    res.sendFile(__dirname + "/form/dashboard.html");
});

app.get("/listar", (req, res) => {
    res.sendFile(__dirname + "/form/listar.html");
});

app.get("/editartarefa/:id", (req, res) => {
    res.sendFile(__dirname + "/form/editar.html");
});

app.get("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const query = 'SELECT id, tarefa, data_final FROM tasks WHERE id = $1';
    client.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching task for editing', err);
            res.status(500).send("Internal Server Error");
        } else {
            res.json(result.rows[0]);
        }
    });
});

app.post("/login", (req, res) => {
    const { mail, senha } = req.body;
    const query = 'SELECT * FROM Form WHERE mail = $1 AND senha = $2';
    client.query(query, [mail, senha], (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).send("Internal Server Error");
        } else {
            if (result.rows.length > 0) {
                res.redirect("/dashboard");
            } else {
                res.redirect('/?error=invalid_credentials');
            }
        }
    });
});

app.get("/inserir", (req, res) => {
    res.sendFile(__dirname + "/form/inserir.html");
});

app.get("/tasks", (req, res) => {
    const query = 'SELECT id, tarefa, data_final FROM tasks';
    client.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching tasks', err);
            res.status(500).send("Internal Server Error");
        } else {
            res.json(result.rows);
        }
    });
});

app.post("/", (req, res) => {
    const { f_name, mail, senha } = req.body;
    const query = 'INSERT INTO Form (name, mail, senha) VALUES ($1, $2, $3)';
    client.query(query, [f_name, mail, senha], (err, result) => {
        if (err) {
            console.error('Error inserting data', err);
            res.status(500).send("Internal Server Error");
        } else {
            res.sendFile(__dirname + "/form/form.html");
        }
    });
});

app.post("/form/inserir", (req, res) => {
    const { tarefa, data_final } = req.body;
    const query = 'INSERT INTO tasks (tarefa, data_final) VALUES ($1, $2)';
    client.query(query, [tarefa, data_final], (err, result) => {
        if (err) {
            console.error('Error inserting task', err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect("/listar");
        }
    });
});

app.post("/atualizartarefa", (req, res) => {
    const {tarefa, data_final, id} = req.body;
    console.log(id)
    const query = 'UPDATE tasks SET tarefa = $1, data_final = $2 WHERE id = $3';
    client.query(query, [tarefa, data_final, id], (err, result) => {
        if (err) {
            console.error('Error updating task', err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect("/listar");
        }
    });
});

app.get("/apagartarefa/:id", async function (req, res){
    try {
    const { id } = req.params;
    const taskDeletada   = await client.query(
      "delete from tasks where id = $1",
      [id],
    );  
  } catch (e) {
    console.log(e);
  }
  res.redirect("/listar");
});
    

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
