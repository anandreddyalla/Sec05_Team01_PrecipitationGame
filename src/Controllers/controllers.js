const ProfessorModel = require('../Models/professorModel.js')
const Level1Model = require('../Models/level1Model.js')
const Level2Model = require('../Models/level2Model.js')
const Level3Model = require('../Models/level3Model.js')
const StudentModel = require('../Models/studentsModel.js')
const dotenv=require('dotenv').config()


const getModelByLevel = (level) => {
    switch(level) {
        case '1': return Level1Model;
        case '2': return Level2Model;
        case '3': return Level3Model;
        default: throw new Error("Invalid level");
    }
};


const login = async(req,res) => {
    try{
        if(req.body){
            const { email, password } = req.body;
            console.log(email, password)
            const fetchUser = await ProfessorModel.findByCredentials(email,password);
            console.log(fetchUser.professorName)
            if(fetchUser.professorName){
                res.status(200).json({response: "Login success", user: fetchUser});
                return
            }

            res.status(301).json({error: fetchUser});
        }
    } catch (error){
        console.log("Error while user login : ", error);
        res.status(500).send({error : error});
    }
}


const register = async(req,res) => {
    try{
        if(req.body){
            const user = new ProfessorModel(req.body);
            await user.save();
            console.log("user ",user)
            if(user){
               console.log("User account created");
               res.status(200).send({response: "Account created successfully"});
               return 
            }
            res.status(500).send({error: "Something went wrong"});
            return 
        }
    } catch (error){
        console.log("Failed to create user account");
        res.status(500).send({error: "Failed to create user account"});
    }
}


const getQuestions = async(req, res) => {
    try {
        const { level } = req.query;
        const Model = getModelByLevel(level);
        const questions = await Model.find();
        if (questions.length > 0) {
            res.status(200).send({ quest: questions });
        } else {
            res.status(204).send({ error: "No questions available for this level" });
        }
    } catch (error) {
        console.log("Error fetching questions:", error);
        res.status(500).send({ error: "Failed to get questions" });
    }
}

const addQuestion = async(req, res) => {
    try {
        const { level } = req.query;
        if (req.body && level) {
            const Model = getModelByLevel(level);
            const question = new Model(req.body);
            await question.save();
            console.log("Question added:", question);
            res.status(200).send({ response: "Question added successfully" });
        } else {
            res.status(400).send({ error: "Please provide all required fields, including level" });
        }
    } catch (error) {
        console.log("Error adding question:", error);
        res.status(500).send({ error: "Server error while adding question" });
    }
}

const updateQuestion = async(req, res) => {
    try {
        const { level } = req.query;
        const query = req.query.questionNumber;
        req.body.questionNumber = query;
        console.log("Update request body:", req.body);

        if (query && level) {
            const Model = getModelByLevel(level);
            const updatedQuestion = await Model.updateOne({ questionNumber: query }, { $set: req.body });
            console.log("Question updated:", updatedQuestion);
            res.status(200).send({ response: "Question updated successfully" });
        } else {
            res.status(400).send({ error: "Missing question number or level in query" });
        }
    } catch (error) {
        console.log("Error updating question:", error);
        res.status(500).send({ error: "Server error while updating question" });
    }
}

const deleteQuestion = async(req, res) => {
    try {
        const { level } = req.query;
        const questionNumber = req.query.questionNumber;

        if (questionNumber && level) {
            const Model = getModelByLevel(level);
            const deletedQuestion = await Model.deleteOne({ questionNumber });
            console.log("Question deleted:", deletedQuestion);
            res.status(200).send({ success: "Question deleted successfully" });
        } else {
            res.status(400).send({ error: "Missing question number or level in query" });
        }
    } catch (error) {
        console.log("Error deleting question:", error);
        res.status(500).send({ error: "Server error while deleting question" });
    }
}


const shuffle = (array) => {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const genQuest = async (req, res) => {
    try {

        const level1Questions = await Level1Model.find();
        const level2Questions = await Level2Model.find();
        const level3Questions = await Level3Model.find();

        const set1Questions = level1Questions.filter(question => question.set === 1);
        const set2Questions = level1Questions.filter(question => question.set === 2);
        const shuffledSet1 = shuffle([...set1Questions]);
        const shuffledSet2 = shuffle([...set2Questions]);

        const combinedLevel1 = [];
        const maxLength = Math.max(shuffledSet1.length, shuffledSet2.length);
        for (let i = 0; i < maxLength; i++) {
            if (i < shuffledSet1.length) combinedLevel1.push(shuffledSet1[i]);
            if (i < shuffledSet2.length) combinedLevel1.push(shuffledSet2[i]);
        }

        const shuffledLevel2 = shuffle([...level2Questions]);
        const shuffledLevel3 = shuffle([...level3Questions]);

        return res.status(200).send({
            level1: combinedLevel1,
            level2: shuffledLevel2,
            level3: shuffledLevel3
        });
    } catch (error) {
        console.error('Error generating questions:', error);
        return res.status(500).send({
            message: 'Internal Server Error'
        });
    }
};



module.exports = {
    login,
    register,
    getQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    genQuest
}

/*

const login = async(req,res) => {
    try{

    } catch (error){
        console.log("")
    }
}

*/