var quest
const questionsDiv = document.getElementById('questions');
document.addEventListener('DOMContentLoaded', async function () {
        const questions = await fetch('/api/getQuestions?level=2', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        }).then((res) => res.json())
        console.log("Questions -> ",questions.quest);
        if(questions.quest){
            quest = questions.quest;
            questionsDiv.innerHTML = "";
            quest.forEach(async (item, index) => {
               // console.log(item, item.questionText)
                let template = `<div class="question-container" id=${item.questionNumber} data-correct-option=${item.correctOption}>
                    <h3 class="questIndex">${index+1}</h3>
                    <div class="question statement">
                        ${item.statement}                        
                    </div>
                    <div class="question" id="question">
                        ${item.questionText}
                    </div>
                    <div class="options">`;
            
                item.options.forEach((opt, index) => {
                    const isCorrect = (index + 1) == parseInt(item.correctOption);
                    template += `<button class="option" onclick="checkAnswer(this, '${opt}', ${isCorrect})">${opt}</button>`;
                });
            
                template += `</div>
                            <div class="question-actions">
                                    <button class="edit-button" onclick="editQuestion(this)">Edit</button>
                                    <button class="delete-button" onclick="deleteQuestion(this)">Delete</button>
                            </div>
                            </div>`;
                questionsDiv.innerHTML += template;
            });
            
        }
});



function editQuestion(button) {
    const container = button.closest('.question-container');
    const questionNumber = container.id;
    const statement = container.querySelector('.statement').innerText;
    const questionText = container.querySelector('#question').innerText;
    const options = container.querySelectorAll('.option');
    const correctOption = container.dataset.correctOption;
   // console.log(questionNumber)
    // Create a popup container
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.display="block";
    //console.log("Creating form")
    popup.innerHTML = `
        <div class="popup-content" data-quest="${questionNumber}">
            <label>Statement:</label>
            <input type="text" value="${statement}" class="edit-statement">
            <label>Question:</label>
            <input type="text" value="${questionText}" class="edit-question-input">
            
            <label>Options:</label>
            <div id="options-container">
                ${Array.from(options).map((option, index) => `
                    <input type="text" value="${option.innerText}" class="edit-option-input" data-index="${index + 1}">
                `).join('')}
            </div>
            
            <label>Correct Option (Number):</label>
            <select class="edit-correct-option">
                <option value="1" ${correctOption == 1 ? 'selected' : ''}>Option 1</option>
                <option value="2" ${correctOption == 2 ? 'selected' : ''}>Option 2</option>
                <option value="3" ${correctOption == 3 ? 'selected' : ''}>Option 3</option>
            </select>
            
            <button class="save-btn">Save</button>
            <button class="close-btn">Close</button>
        </div>
    `;

    document.body.appendChild(popup);

    // Close button logic
    popup.querySelector('.close-btn').addEventListener('click', () => {
        popup.remove();
    });

    // Save button logic
    popup.querySelector('.save-btn').addEventListener('click', async() => {
        console.log(popup.dataset)
        const questionNumber = popup.querySelector('.popup-content').dataset.quest;
        const updatedStatement = popup.querySelector('.edit-statement').value;
        const updatedQuestion = popup.querySelector('.edit-question-input').value;
        const updatedOptions = Array.from(popup.querySelectorAll('.edit-option-input')).map(input => input.value);
        const updatedCorrectOption = popup.querySelector('.edit-correct-option').value;

        const data = {
            statement: updatedStatement,
            questionNumber: questionNumber,
            questionText: updatedQuestion,
            options: updatedOptions,
            correctOption: updatedCorrectOption
        };
        console.log(data) // updateQuestion
        const update = await fetch(`/api/updateQuestion?questionNumber=${questionNumber}&level=2`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((res) => res.json())
            if (update.response) {
                alert('Question updated successfully');
                popup.remove();
                window.location.reload(true);
            } else {
                alert('Error updating question');
            }
        });
};


async function deleteQuestion(button) {  
    const container = button.closest('.question-container');
    const questionNumber = container.id
    const deleteQuest = await fetch(`/api/deleteQuestion?questionNumber=${questionNumber}&level=2`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    }).then((res) => res.json())
    if(deleteQuest.success){
        alert("Question deleted!");
        container.remove();
    } else {
        alert("Failed to delete question!");
    }

}


async function addNewQuestion() {
    const statement = document.getElementById('statement').value;
    const questionText = document.getElementById('questionText').value;
    const option1 = document.getElementById('option1').value;
    const option2 = document.getElementById('option2').value;
    const option3 = document.getElementById('option3').value;

    const correctOption = document.getElementById('correct-option').value;

    const data = {
        statement: statement,
        questionText,
        options: [option1,option2,option3],
        correctOption
    }
    console.log(data);
    const addQuest = await fetch('/api/addQuestion?level=2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((res) => res.json())
    console.log(addQuest);
    if(addQuest.response){
        alert("Question added");
        statement.value = "";
        questionText.value = "";
        option1.value="";
        option2.value="";
        option3.value="";
        correctOption.value="";
        window.location.reload(true);
        closePopup();
    } else {
        alert("Something went  wrong while adding Question");
    }
     
}

function checkAnswer(optionElement, optionValue, isCorrect) {
    const allOptions = optionElement.parentElement.querySelectorAll('.option');
    allOptions.forEach(option => option.disabled = true);

    if (isCorrect) {
        optionElement.classList.add('correct');
    } else {
        optionElement.classList.add('incorrect');
    }
}




function openPopup() {
    document.getElementById('popup').classList.add('active');
    document.body.classList.add('modal-open');
}

function closePopup() {
    document.getElementById('popup').classList.remove('active');
    document.body.classList.remove('modal-open');
}