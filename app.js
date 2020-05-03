const express = require('express')
const app = express()
const path = require('path')
var mysql = require('mysql')
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
})

const port = 1337
// connection mysql

const connection = mysql.createConnection({
    //user connection
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'supermarche'

});

connection.connect(function (error) {
    //condition connect
    if (!!error) {
        console.log('Failed to connect :(');
    } else {
        console.log('Connected :D');
    }

});
// use EJS

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// import ext file ex : Style.css

app.use(express.static(path.join(__dirname, 'public')));

//GET PAGES
app.get("/admin", (req, res) => {
    res.render('admin')
});
app.get("/admin-update", (req, res) => {
    res.render('update')
});
app.get("/fournisseur", (req, res) => {
    connection.query('SELECT * FROM fournisseur', (error, rows) => {
        if (error) {
            console.log("Error getting data")
        } else {
            res.render('fournisseur',{ fournisseurdata : rows})
        }
    })
});
app.get("/rayon", (req, res) => {
    connection.query('SELECT * FROM rayon', (error, rows) => {
        if (error) {
            console.log("Error getting data")
        } else {
            res.render('rayon',{ rayondata : rows})
        }
    })
});
app.get("/produit", (req, res) => {
    connection.query('SELECT * FROM produit', (error, rows) => {
        if (error) {
            console.log("Error getting data")
        } else {
            res.render('produit',{ produitdata : rows})
        }
    })
});
//POST
app.post("/fournisseur", urlencodedParser, (req, res) => {
    let postData = {
        name: req.body.name,
        email: req.body.email,
        telephone: req.body.telephone,
        adresse: req.body.adresse
    }

    let sql = "INSERT INTO fournisseur SET ?"
    connection.query(sql, postData, (error, result) => {
        if (error) {
            console.log("Your Data Not Submited , TRY AGAIN");
        } else {
            console.log("Successfully");
        }

    })
    res.redirect('/admin')
});
//POST RAYON
app.post("/rayon", urlencodedParser, (req, res) => {
    let postData = {
        category: req.body.category,
        info_rayon: req.body.info_rayon
    }

    let sql = "INSERT INTO rayon SET ?"
    connection.query(sql, postData, (error, result) => {
        if (error) {
            console.log("Your Data Not Submited , TRY AGAIN");
        } else {
            console.log("Successfully");
        }

    })
    res.redirect('/admin')
});
//POST Produit
app.post("/produit", urlencodedParser, (req, res) => {
    let postData = {
        name: req.body.name,
        image: req.body.image,
        quantite: req.body.quantite,
        price: req.body.price,
        id_rayon: req.body.id_rayon,
        id_fournisseur: req.body.id_fournisseur
    }

    let sql = "INSERT INTO produit SET ?"
    connection.query(sql, postData, (error, result) => {
        if (error) {
            console.log("Your Data Not Submited , TRY AGAIN");
        } else {
            console.log("Successfully");
        }

    })
    res.redirect('/admin')
});
//UPDATE 
//Fournisseur
app.post('/updatefournisseur', urlencodedParser, (req, res) => {

    let reqbody1 = [req.body.name, req.body.email, req.body.telephone, req.body.adresse, req.body.id_fournisseur]
    let sql = 'UPDATE `fournisseur` SET `name`=?,`email`=?,`telephone`=?,`adresse`=?  where `id_fournisseur`=?'

    connection.query(sql, reqbody1, (error) => {
        if (error) {
            console.log("NO CHANGE DATA")
        } else {
            console.log("Data have been changed")
        }

    });
    res.redirect('/admin-update')
});
//RAYON
app.post('/updaterayon', urlencodedParser, (req, res) => {

    let reqbody2 = [req.body.category, req.body.info_rayon, req.body.id_rayon]
    let sql = 'UPDATE `rayon` SET `category`=?,`info_rayon`=? where `id_rayon`=?'

    connection.query(sql, reqbody2, (error) => {
        if (error) {
            console.log("NO CHANGE DATA")
        } else {
            console.log("Data have been changed")
        }

    });
    res.redirect('/admin-update')
});
//Produit
app.post('/updateproduit', urlencodedParser, (req, res) => {

    let reqbody3 = [req.body.name, req.body.image, req.body.quantite, req.body.price, req.body.id_fournisseur, req.body.id_rayon, req.body.id_produit]
    let sql = 'UPDATE `produit` SET `name`=?,`image`=?,`quantite`=?,`price`=?,`id_fournisseur`=?,`id_rayon`=? where `id_produit`=?'

    connection.query(sql, reqbody3, (error) => {
        if (error) {
            console.log("NO CHANGE DATA")
        } else {
            console.log("Data have been changed")
        }

    });
    res.redirect('/admin-update')
});
//Delete
app.get("/del-fournisseur/:id", (req, res, next) => {

    connection.query('DELETE FROM fournisseur WHERE id_fournisseur = ?', [req.params.id], (error, result) => {
        if (!!error) {
            console.log("Data not Deleted");
            next()
        }
        console.log("Data Deleted Successfully");
        next()

    });
    res.redirect('/fournisseur')
})
app.get("/del-rayon/:id", (req, res, next) => {

    connection.query('DELETE FROM rayon WHERE id_rayon = ?', [req.params.id], (error, result) => {
        if (!!error) {
            console.log("Data not Deleted");
            next()
        }
        console.log(" Data Deleted Successfully");
        next()

    });
    res.redirect('/rayon')
})
//delete produit
app.get("/del-produit/:id", (req, res, next) => {

    connection.query('DELETE FROM produit WHERE id_produit = ?', [req.params.id], (error, result) => {
        if (!!error) {
            console.log("Data not Deleted");
            next()
        }
        console.log(" Data Deleted Successfully");
        next()

    });
    res.redirect('/produit')
})
// START SERVER
app.listen(port, function () {
    console.log(`listening on port ${port}...`)
});