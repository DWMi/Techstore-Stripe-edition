/* import fetch from "node-fetch" */

fetch("http://localhost:3000/checkLogin")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
    });

const rightItems = document.querySelector('.rightItems'),
accountStuff = document.createElement('div'),
signInBtn = document.createElement('div'),
signUpBtn = document.createElement('div')

const main = document.querySelector('#main')
const body = document.querySelector('body')
const navbar = document.querySelector('.navbar')

accountStuff.classList.add('accountStuff')
signInBtn.classList.add('signInBtn')
signUpBtn.classList.add('signUpBtn')
signInBtn.innerText = 'Sign In'
signUpBtn.innerText = 'Sign Up'
rightItems.prepend(accountStuff)
accountStuff.append(signUpBtn)
accountStuff.append(signInBtn)

const signUpForm =()=>{

    const signUpFormCon = document.createElement('div'),
        signUpCover = document.createElement('div'),
        signUpForm = document.createElement('div'),
        signUpUsername = document.createElement('input'),
        signUpPassword = document.createElement('input'),
        signUpEmail = document.createElement('input'),
        signUpSubmitBtn = document.createElement('button'),
        exitSignUpFormCon = document.createElement('div'),
        exitSignUpForm = document.createElement('div'),
        signUpAddress = document.createElement('input'),
        signUpZip = document.createElement('input'),
        signUpCity = document.createElement('input')

        signUpEmail.classList.add('signUpEmail')
        signUpCover.classList.add('signUpCover')
        signUpFormCon.classList.add('signUpFormCon')
        signUpForm.classList.add('signUpForm')
        signUpUsername.classList.add('signUpUsername')
        signUpPassword.classList.add('signUpPassword')
        signUpSubmitBtn.classList.add('signUpSubmitBtn')
        exitSignUpFormCon.classList.add('exitSignUpFormCon')
        exitSignUpForm.classList.add('exitSignUpForm')
        signUpAddress.classList.add('signUpAddress')
        signUpZip.classList.add('signUpZip')
        signUpCity.classList.add('signUpCity')
        
        
        body.append(signUpCover)
        signUpCover.append(signUpFormCon)
        signUpFormCon.append(signUpForm)
        signUpForm.append(exitSignUpFormCon)
        exitSignUpFormCon.append(exitSignUpForm)
        signUpForm.append(signUpUsername)
        signUpForm.append(signUpPassword)
        signUpForm.append(signUpEmail)
        signUpForm.append(signUpAddress)
        signUpForm.append(signUpZip)
        signUpForm.append(signUpCity)
        signUpForm.append(signUpSubmitBtn)  

        exitSignUpForm.innerText ='❌'
        signUpUsername.placeholder = 'Full name'
        signUpPassword.placeholder = 'Password'
        signUpEmail.placeholder = 'Email'
        signUpAddress.placeholder = 'Address'
        signUpZip.placeholder ='Zipcode'
        signUpEmail.type ='Email'
        signUpPassword.type = 'Password'
        signUpAddress.type = 'Address'
        signUpZip.type ='text'
        signUpCity.placeholder = 'City'
        signUpEmail.setAttribute('required','')
        signUpUsername.setAttribute('required','')
        signUpPassword.setAttribute('required','')
        signUpAddress.setAttribute('required','')
        signUpCity.setAttribute('required','')
        signUpZip.setAttribute('required','')
        signUpZip.setAttribute('maxLength','5')
        signUpSubmitBtn.innerHTML = 'Sign Up'
        main.style.filter='blur(8px)'
        body.style.overflowY='hidden'
        navbar.style.filter='blur(8px)'

        exitSignUpForm.addEventListener('click',()=>{
        body.removeChild(signUpCover)
        main.style.filter=''
        body.style.overflowY=''
        navbar.style.filter=''
        })

        signUpSubmitBtn.addEventListener('click', () => {
            let userObj = {
                username: signUpUsername.value,
                password: signUpPassword.value,
                email: signUpEmail.value,
                address: signUpAddress.value,
                city: signUpCity.value,
                zip: signUpZip.value

            }
            fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                }, 
                body: JSON.stringify(userObj)
                
              })
                .then(res => res.json())
                .then((data) => console.log(data))
                /* .then((data) => setWeek(data)); */
        
        })

}

const signInForm = ()=>{

    const signInFormCon = document.createElement('div'),
        signInCover = document.createElement('div'),
        signInForm = document.createElement('div'),
        signInUsername = document.createElement('input'),
        signInPassword = document.createElement('input'),
        signInSubmitBtn = document.createElement('button'),
        exitSignInFormCon = document.createElement('div'),
        exitSignInForm = document.createElement('div')


        signInCover.classList.add('signInCover')
        signInFormCon.classList.add('signInFormCon')
        signInForm.classList.add('signInForm')
        signInUsername.classList.add('signInUsername')
        signInPassword.classList.add('signInPassword')
        signInSubmitBtn.classList.add('signInSubmitBtn')
        exitSignInFormCon.classList.add('exitSignInFormCon')
        exitSignInForm.classList.add('exitSignInForm')
        
        
        body.append(signInCover)
        signInCover.append(signInFormCon)
        signInFormCon.append(signInForm)
        signInForm.append(exitSignInFormCon)
        exitSignInFormCon.append(exitSignInForm)
        signInForm.append(signInUsername)
        signInForm.append(signInPassword)
        signInForm.append(signInSubmitBtn)  


        exitSignInForm.innerText ='❌'
        signInUsername.placeholder = 'Username'
        signInPassword.placeholder = 'Password'
        signInPassword.type = 'Password'
        signInUsername.setAttribute('required','')
        signInPassword.setAttribute('required','')
        signInSubmitBtn.innerHTML = 'Sign In'
        main.style.filter='blur(8px)'
        body.style.overflowY='hidden'
        navbar.style.filter='blur(8px)'

        exitSignInForm.addEventListener('click',()=>{
        body.removeChild(signInCover)
        main.style.filter=''
        body.style.overflowY=''
        navbar.style.filter=''
        })

        signInSubmitBtn.addEventListener('click', () => {
            let userObj = {
                username: signInUsername.value,
                password: signInPassword.value
            }
            fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                }, 
                body: JSON.stringify(userObj)
                
              })
                .then(res => res.json())
                .then((data) => console.log(data))    
        })
        
}   
signInBtn.addEventListener('click',signInForm)

signUpBtn.addEventListener('click', signUpForm)