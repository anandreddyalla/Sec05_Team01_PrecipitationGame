const userForm = document.getElementById('professor-login-form')
userForm.addEventListener('submit', async(e) => {
    {
        console.log("Login initiated")
        e.preventDefault();
        const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        console.log(formDataObject);
        const login = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        }).then((res) => res.json())
        console.log(login);
        if(login.response){
            alert("Success");
            userForm.reset();
           // window.localStorage.setItem('token', login.token);
            window.localStorage.setItem('email', login.user.email);
            window.location.href='dashboard.html';
        }else{
            userForm.reset();
            alert("Wrong Password / Email");
        }
        
    }
})