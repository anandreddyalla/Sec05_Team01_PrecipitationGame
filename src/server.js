const express = require('express')
const port = 8080
const server = express()
const cors = require('cors')
const helmet = require('helmet')
const path=require('path')
const publicPath=path.join(__dirname,'../public')
const connectDb = require("./database/mongooseConnection.js")
const Routers = require('./Routers/routes.js')

server.use(express.static(publicPath));
server.use(express.urlencoded({ extended: true }));
server.use(express.json())

// Test API
server.get('/test', (req,res) => {
    res.send("Server is running...");
})

server.use('/api', Routers);
server.use(cors());
server.use(
	helmet({
	  contentSecurityPolicy: false,
	  xDownloadOptions: false,
	})
  );

var correct_dict = {
	"K⁺,Cl⁻":"Hg₂(NO₃)₂",
	"2Na⁺,C₂O₄²⁻":"CaCl₂", 
	"K⁺,F⁻":"MgSO₄", 
	"Al³⁺,3Cl⁻":"NaOH",
	"2Na⁺,CO₃²⁻":"CaO",
	"Pb²⁺,2NO₂⁻":"Na₃PO₄",
	"Ca²⁺,2Br⁻":"K₂CO₃",
	"K⁺,NO₃⁻":"FeCl₃",
	"Fe²⁺,2Cl⁻":"NaOH",
	"Na+,PO₄³⁻":"CaCl₂",
	"K⁺,AsO₄³⁻":"FeCl₂",
	"Cd²⁺,SO₄²⁻":"Na₂S",
	"Cr³⁺,SCN⁻":"NaOH",
	"LiClO4":"CuO",
	"NO₃⁻,Ag⁺":"NaCl",
	"K⁺,CrO₄²⁻":"BaCl₂",
	"Na⁺,PO₄³⁻,OH⁻":"Ca(NO₃)₂",
	"Na⁺,AsO₄³⁻,OH⁻":"CuCl₂",
	"Cl⁻,Hg²⁺,O²⁻": "K₂S", 
	"Hg²⁺,NO₃⁻": "Na₂CO₃"
	}

var problem_dict = {
	"K⁺,Cl⁻":["Hg₂(NO₃)₂", "AgBr", "MgCO₃"],
	"2Na⁺,C₂O₄²⁻":["CaCl₂", "CaSO₄","KCl"], 
	"K⁺,F⁻":["MgSO₄", "CuS","Ca₃(PO₄)₂"], 
	"Al³⁺,3Cl⁻":["NaOH", "Ba₃(PO₄)₃", "KClO₃"],
	"2Na⁺,CO₃²⁻":["CaO", "NH₄I", "Fe(OH)₃"],
	"Pb²⁺,2NO₂⁻":["Na₃PO₄", "ZnClO₄", "NiS"],
	"Ca²⁺,2Br⁻":["K₂CO₃", "MgCl₂", "NH₄C₂H₃O₂"],
	"K⁺,NO₃⁻":["FeCl₃", "Al₂(SO₄)₃", "Ag₂CO₃"],
	"Fe²⁺,2Cl⁻":["NaOH", "KSCN", "LiC₂H₃O₂"],
	"Na+,PO₄³⁻":["CaCl₂", "NH₄F", "KI"],
	"K⁺,AsO₄³⁻":["FeCl₂","NaBr", "KF"],
	"Cd²⁺,SO₄²⁻":["Na₂S", "NaC₂H3O₂", "K₂SO₄"],
	"Cr³⁺,SCN⁻":["NaOH", "KClO₄", "Na₂SO₄"],
	"LiClO4":["CuO", "AlBr3", "Ca(OH)2"],
	"NO₃⁻,Ag⁺":["NaCl", "KF", "Ca(ClO₄)₂"],
	"K⁺,CrO₄²⁻":["BaCl₂", "KCl", "LiBr"],
	"Na⁺,PO₄³⁻,OH⁻":["Ca(NO₃)₂", "NaOH", "KBr"],
	"Na⁺,AsO₄³⁻,OH⁻":["CuCl₂", "KC₂H₃O₂", "NaI"],
	"Cl⁻,Hg²⁺,O²⁻":["K₂S", "KBr", "NaCl"], 
	"Hg²⁺,NO₃⁻": ["Na₂CO₃", "KClO₄", "LiNO₃"]
	}

server.get('/godot', (req,res) => {
  res.status(200).json({correct_dict : correct_dict, problem_dict : problem_dict})
})

connectDb().then(() => {
    try {
		server.listen(port, () => {
			console.log(`Server started at http://localhost:${port}`);
		});
	} catch (err) {
		console.log("Unable to connect to the database due to: ", err);
    }
});