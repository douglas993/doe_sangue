const express = require('express');
const server = express();

//Configurando servidor para apresentar arquivos extras
server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))


//Configurando banco de dados
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'blood_donors',
})

//Configurando a template
const nunjucks = require('nunjucks')
nunjucks.configure("../", {
    express: server,
    noCache: true,
})



server.get("/", function(req, res) {
    // return res.send("Rota inicial OK")
    db.query("SELECT * FROM public.dados", function(err, result) {
        if (err) return res.send("Erro no Get do BD")
        const donors = result.rows;

        return res.render("index.html", { donors })
    })
})


server.post("/", function(req, res) {
    const name = req.body.name;
    const blood = req.body.blood;
    const email = req.body.email;

    if (name == "" || blood == "" || email == "") {
        return res.send("Todos os campos são obrigatorios.")
    } else {


        //Colocando valores dentro do Banco de dados
        const query = `
        INSERT INTO public.dados("name", "email", "blood") 
        VALUES ($1, $2, $3)`

        const values = [name, email, blood]

        db.query(query, values, function(err) {
            if (err) return res.send("Erro no banco de dados")

            return res.redirect("/")
        })

    }
})



server.listen(3000, function() {
    console.log("API Online");

});