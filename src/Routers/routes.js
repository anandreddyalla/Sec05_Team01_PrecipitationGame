const express=require("express")
const jwt=require("jsonwebtoken")
const router = new express.Router()
const Controller = require("../Controllers/controllers.js")
const Jwt_Secret="thisisseceret"

router.get("/test",(req,res)=>{
    res.send({
        name:"server is working"
    })
})
router.get('/genQuestions', Controller.genQuest)
router.get('/getQuestions', Controller.getQuestions);
router.get('/deleteQuestion', Controller.deleteQuestion);

router.post('/login', Controller.login);
router.post('/register', Controller.register);
router.post('/addQuestion', Controller.addQuestion);
router.post('/updateQuestion', Controller.updateQuestion);

module.exports = router