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
rightItems.append(accountStuff)
accountStuff.append(signUpBtn)
accountStuff.append(signInBtn)

const signUpForm =()=>{

    const signUpFormCon = document.createElement('div'),
        signUpCover = document.createElement('div'),
        signUpForm = document.createElement('div'),
        signUpUsername = document.createElement('input'),
        signUpPassword = document.createElement('input'),
        signUpSubmitBtn = document.createElement('button'),
        exitSignUpFormCon = document.createElement('div'),
        exitSignUpForm = document.createElement('div')


        signUpCover.classList.add('signUpCover')
        signUpFormCon.classList.add('signUpFormCon')
        signUpForm.classList.add('signUpForm')
        signUpUsername.classList.add('signUpUsername')
        signUpPassword.classList.add('signUpPassword')
        signUpSubmitBtn.classList.add('signUpSubmitBtn')
        exitSignUpFormCon.classList.add('exitSignUpFormCon')
        exitSignUpForm.classList.add('exitSignUpForm')
        
        
        body.append(signUpCover)
        signUpCover.append(signUpFormCon)
        signUpFormCon.append(signUpForm)
        signUpForm.append(exitSignUpFormCon)
        exitSignUpFormCon.append(exitSignUpForm)
        signUpForm.append(signUpUsername)
        signUpForm.append(signUpPassword)
        signUpForm.append(signUpSubmitBtn)  


        exitSignUpForm.innerText ='❌'
        signUpUsername.placeholder = 'Username'
        signUpPassword.placeholder = 'Password'
        signUpPassword.type = 'Password'
        signUpUsername.setAttribute('required','')
        signUpPassword.setAttribute('required','')
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
}   
signInBtn.addEventListener('click',signInForm)

signUpBtn.addEventListener('click', signUpForm)