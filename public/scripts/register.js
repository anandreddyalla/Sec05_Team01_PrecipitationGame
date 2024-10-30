
const signupForm = document.getElementById('professor-register-form');

signupForm.addEventListener('submit', async (e) => {
        console.log("signup form initiated")
        e.preventDefault();
        const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
      console.log(formDataObject);
      if(document.getElementById("password").value === document.getElementById("confirmpassword").value ){

        const register = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        }).then((res) => res.json())
        console.log(register);
        if(register.response){
            alert("Success!");
            window.location = "index.html"
        }else{
            alert("Error while registering!");
        }
      } else {
        alert("Passwords doesn't match, Please enter same password twice!");
      }

    });


