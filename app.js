var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');


var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "ozilsanchez"))
var session = driver.session()


// Home page
app.get('/', function(req, res){
    session
        .run("MATCH (n: Treatment) RETURN n")
        .then(function(result){
            var tArr = [];
            
            result.records.forEach(function(record){
                //console.log(record._fields[0]);
                tArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name
                });

            })


            session
                .run("MATCH (d: Disease) RETURN d")
                .then(function(result2){
                    var dArr = [];
                    result2.records.forEach(function(record){
                        //console.log(record._fields[0]);
                        dArr.push({
                            id: record._fields[0].identity.low,
                            name: record._fields[0].properties.name
                        });
        
                    })

                    session
                        .run("MATCH (s: Symtom) RETURN s")
                        .then(function(result3){
                            var sArr = [];
                            result3.records.forEach(function(record){
                                sArr.push({
                                    id: record._fields[0].identity.low,
                                    name: record._fields[0].properties.name
                                });
                            })

                            res.render('index', {
                                disease: dArr,
                                treatment: tArr,
                                symtom: sArr
                            });
                        })
                })
        })
        .catch(function(error){
            console.log(error)
        });

});


app.get('/disease', function(req, res){
    session
        .run("MATCH (n: Disease) RETURN n")
        .then(function(result){
            var oArr = [];
            
            result.records.forEach(function(record){
                //console.log(record._fields[0]);
                oArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name
                });

            })
            
            res.render('detail', {
                disease: oArr
            });
        });

    })

    app.get('/treatment', function(req, res){
        session
            .run("MATCH (f: Treatment) RETURN f")
            .then(function(result){
                var jArr = [];
                
                result.records.forEach(function(record){
                    //console.log(record._fields[0]);
                    jArr.push({
                        id: record._fields[0].identity.low,
                        name: record._fields[0].properties.name
                    });
    
                })
                
                res.render('detailsym', {
                    treatment: jArr
                });
            });
    
        })

        app.get('/symptom', function(req, res){
            session
                .run("MATCH (y: Symtom) RETURN y")
                .then(function(result){
                    var uArr = [];
                    
                    result.records.forEach(function(record){
                        //console.log(record._fields[0]);
                        uArr.push({
                            id: record._fields[0].identity.low,
                            name: record._fields[0].properties.name
                        });
        
                    })
                    
                    res.render('detailof', {
                        symtom: uArr
                    });
                });
        
            })    


// Disease Details
app.get('/dis/:id', function(req, res){
    var id = req.params.id;
    res.send(id);
});


// Disease Details
app.get('/disease/:id', function(req, res){
    var id = req.params.id;
    
    session
    .run("OPTIONAL MATCH (a:Disease)-[r:Treated_By]-(b:Treatment) WHERE id(a)=toInteger($idParam) RETURN b", {idParam:id})
        .then(function(result){
            var tlArray = [];
            var t2Array = [];


            result.records.forEach(function(record){
                if(record._fields[0] != null){
                    tlArray.push({
                        id: record._fields[0].identity.low,
                        name: record._fields[0].properties.name
                    });
                }
            });

            session
            .run("OPTIONAL MATCH (a:Disease)-[r:Symtom]-(b:Symtom) WHERE id(a)=toInteger($idParam) RETURN b", {idParam:id})
            .then(function(result2){
                result2.records.forEach(function(record){
                    if(record._fields[0] != null){
                        t2Array.push({
                            id: record._fields[0].identity.low,
                            name: record._fields[0].properties.name
                        });
                    }
                });
                res.render('disease', {
                    id: id,
                    tl: tlArray,
                    t2: t2Array
                })
            })
            .catch(function(error){
                console.log(error)
            })

        })
        .catch(function(error){
            console.log(error)
        });
});


// Treatment Details
app.get('/tre/:id', function(req, res){
    var id = req.params.id;
    res.send(id);
});


// Treatment Details
app.get('/treatment/:id', function(req, res){
    var id = req.params.id;
    
    session
    .run("OPTIONAL MATCH (a:Disease)-[r:Treated_By]-(b:Treatment) WHERE id(b)=toInteger($idParam) RETURN a", {idParam:id})
        .then(function(result){
            var tlArray = [];


            result.records.forEach(function(record){
                if(record._fields[0] != null){
                    tlArray.push({
                        id: record._fields[0].identity.low,
                        name: record._fields[0].properties.name
                    });
                }
            });

            res.render('treatment', {
                id: id,
                tl: tlArray
            })
        })
        .catch(function(error){
            console.log(error)
        });
});


// Symtom Details
app.get('/sym/:id', function(req, res){
    var id = req.params.id;
    res.send(id);
});


// Symtom Details
app.get('/symtom/:id', function(req, res){
    var id = req.params.id;
    
    session
    .run("OPTIONAL MATCH (a:Disease)-[r: Symtom]-(b:Symtom) WHERE id(b)=toInteger($idParam) RETURN a", {idParam:id})
        .then(function(result){
            var tlArray = [];


            result.records.forEach(function(record){
                if(record._fields[0] != null){
                    tlArray.push({
                        id: record._fields[0].identity.low,
                        name: record._fields[0].properties.name
                    });
                }
            });

            res.render('symtom', {
                id: id,
                tl: tlArray
            })
        })
        .catch(function(error){
            console.log(error)
        });
});


// New Add Disease
app.get('/add', function(req, res){
    res.render('AddDisease')
});

app.post('/disease/add', function(req, res){
    var dname = req.body.name;
    var ddescription = req.body.description;
    session
        .run("CREATE(n:Disease {name: $nameParam, description: $desParam})", {nameParam: dname, desParam: ddescription})
        .then(function(result){
            res.render('Success');
        });
});

// New Add Treatment
app.get('/addT', function(req, res){
    res.render('AddTreatment')
});

app.post('/treatment/add', function(req, res){
    var tname = req.body.name;
    session
        .run("CREATE(n:Treatment {name: $tnameParam})", {tnameParam: tname})
        .then(function(result){
            res.render('Success');
        });
});

// New Add Symtoms
app.get('/addS', function(req, res){
    res.render('AddSymtoms')
});

app.post('/symtoms/add', function(req, res){
    var sname = req.body.name;
    //console.log(sname);
    session
        .run("CREATE(s:Symtom {name: $snameParam})", {snameParam: sname})
        .then(function(result){
            res.render('Success');
        });
});

//Add Relationship Between Disease and Treatment
app.get('/addRT', function(req,res){
    res.render('AddRT')
});

app.post('/relationship/addT', function(req, res){
    var name1 = req.body.name1;
    var name2 = req.body.name2;
    
    session
        .run("match (d:Disease {name: $nameParam1}) , (t:Treatment {name: $nameParam2}) merge(d)-[r:Treated_By]->(t)", {nameParam1: name1, nameParam2: name2})
        .then(function(result){
            res.render('Success');
            //session.close();
        })
        .catch(function(error){
            console.log(error);
        });
});

//Add Relationship Between Disease and Symtom
app.get('/addRS', function(req,res){
    res.render('AddRS')
});

app.post('/relationship/addS', function(req, res){
    var name1 = req.body.name1;
    var name2 = req.body.name2;
    
    session
        .run("match (d:Disease {name: $nameParam1}) , (s:Symtom {name: $nameParam2}) merge(d)-[r:Symtom]->(s)", {nameParam1: name1, nameParam2: name2})
        .then(function(result){
            res.render('Success')
            //session.close();
        })
        .catch(function(error){
            console.log(error);
        });
});


// Delete Disease
app.get('/deleteD', function(req,res){
    res.render('DeleteD')
});

app.post('/relationship/deleteD', function(req, res){
    var name1 = req.body.name1;
 
    
    session
        .run("match (d:Disease {name: $nameParam1}) DETACH DELETE d", {nameParam1: name1})
        .then(function(result){
            res.render('Delete_Success')
            //session.close();
        })
        .catch(function(error){
            console.log(error);
        });
});

// Delete Treatment
app.get('/deleteT', function(req,res){
    res.render('DeleteT')
});

app.post('/relationship/deleteT', function(req, res){
    var name1 = req.body.name1;
 
    
    session
        .run("match (t:Treatment {name: $nameParam1}) DETACH DELETE t", {nameParam1: name1})
        .then(function(result){
            res.render('Delete_Success')
            //session.close();
        })
        .catch(function(error){
            console.log(error);
        });
});

// Delete Symtom
app.get('/deleteS', function(req,res){
    res.render('DeleteS')
});

app.post('/relationship/deleteS', function(req, res){
    var name1 = req.body.name1;
 
    
    session
        .run("match (s:Symtom {name: $nameParam1}) DETACH DELETE s", {nameParam1: name1})
        .then(function(result){
            res.render('Delete_Success')
            //session.close();
        })
        .catch(function(error){
            console.log(error);
        });
});


//About page

app.get('/about', function(req, res){
    res.render('About')
});

//Search

app.get('/search', function(req, res){
    res.render('Search')
})

app.post('/searchR', function(req, res){
    var name = req.body.name;
    
    session
        .run("MATCH (n:Disease {name: $nameParam}) RETURN n", {nameParam: name})
        .then(function(result){
            var tArr = [];
            
            result.records.forEach(function(record){
                tArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name,
                    t: record._fields[0].properties.description
                });

            })
            if(tArr.length < 1)
            {
                res.render('Notfound')
            }
            else
            {
                //console.log(tArr[0].name)
                
                res.render('Found', {
                    t1Arr: tArr
                })
            }
        })
        .catch(function(error){
            console.log(error);
        });
})


app.listen(3000);

console.log('Server started on port 3000');

module.exports = app;