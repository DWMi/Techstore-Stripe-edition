export let loggedInUser = await checkLogIn()

async function checkLogIn() {
    let url = "http://localhost:3000/checkLogin"
    let method = "GET"
    let result = await makeRequest(url, method, undefined)
    return result;

}



const rightItems = document.querySelector('.rightItems'),
    accountStuff = document.createElement('div'),
    signInBtn = document.createElement('div'),
    signUpBtn = document.createElement('div'),
    signOutBtn = document.createElement('div'),
    userBtn = document.createElement('div'),
    loginStuff = document.createElement('div'),
    myOrder = document.createElement('div'),
    userStuff = document.createElement('div'),
    userStuffCC = document.createElement('div'),
    userStuffClose = document.createElement('div'),
    userNameCon = document.createElement('div'),
    userName = document.createElement('h3')

const main = document.querySelector('#main'),
    body = document.querySelector('body'),
    navbar = document.querySelector('.navbar')

userNameCon.classList.add('userNameCon')
userName.classList.add('userName')
userStuffCC.classList.add('userStuffCC')
userStuffClose.classList.add('userStuffClose')
userStuff.classList.add('userStuff')
userBtn.classList.add('userBtn')
loginStuff.classList.add('loginStuff')
myOrder.classList.add('myOrder')
accountStuff.classList.add('accountStuff')
signInBtn.classList.add('signInBtn')
signUpBtn.classList.add('signUpBtn')
signOutBtn.classList.add('signOutBtn')

userBtn.innerHTML = '<i class="fa fa-user-circle" aria-hidden="true"></i>'
signInBtn.innerText = 'Sign In'
signUpBtn.innerText = 'Sign Up'
signOutBtn.innerText = 'Logout'
userStuffClose.innerText = '❌'
userStuffClose.style.textAlign = 'right'
myOrder.innerText = 'My Orders'
userName.innerText = loggedInUser.name

rightItems.prepend(accountStuff)
rightItems.prepend(userNameCon)
accountStuff.append(userBtn)
body.prepend(userStuff)
userStuff.append(userStuffCC)
userNameCon.append(userName)
userStuffCC.append(userStuffClose)
userStuff.append(myOrder)
userStuff.append(loginStuff)
loginStuff.append(signUpBtn)
loginStuff.append(signInBtn)
loginStuff.append(signOutBtn)

if (loggedInUser.loggedIn) {
    loginStuff.removeChild(signInBtn)
    loginStuff.removeChild(signUpBtn)
} else {
    userNameCon.removeChild(userName)
    userStuff.removeChild(myOrder)
    loginStuff.removeChild(signOutBtn)
}

const signUpForm = () => {

    const signUpFormCon = document.createElement('div'),
        signUpCover = document.createElement('div'),
        signUpForm = document.createElement('form'),
        signUpUsername = document.createElement('input'),
        signUpPassword = document.createElement('input'),
        signUpEmail = document.createElement('input'),
        signUpSubmitBtn = document.createElement('button'),
        exitSignUpFormCon = document.createElement('div'),
        exitSignUpForm = document.createElement('div'),
        signUpAddress = document.createElement('input'),
        signUpZip = document.createElement('input'),
        signUpCity = document.createElement('input'),
        errorMsg = document.createElement('p')

    errorMsg.classList.add('errorMsg')
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
    signUpForm.append(signUpUsername, signUpPassword, signUpEmail, signUpAddress, signUpZip, signUpCity, errorMsg, signUpSubmitBtn)
 

    exitSignUpForm.innerText = '❌'
    signUpUsername.placeholder = 'Full name'
    signUpUsername.pattern 
    signUpPassword.placeholder = 'Password'
    signUpEmail.placeholder = 'Email'
    signUpEmail.pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
    signUpAddress.placeholder = 'Address'
    signUpZip.placeholder = 'Zipcode'
    signUpEmail.type = 'email'
    signUpPassword.type = 'Password'
    signUpAddress.type = 'Address'
    signUpZip.type = 'text'
    signUpCity.placeholder = 'City'
    signUpEmail.setAttribute('required', '')
    signUpUsername.setAttribute('required', '')
    signUpPassword.setAttribute('required', '')
    signUpAddress.setAttribute('required', '')
    signUpCity.setAttribute('required', '')
    signUpZip.setAttribute('required', '')
    signUpZip.setAttribute('maxLength', '5')
    signUpZip.setAttribute('minLength', '5')
    signUpSubmitBtn.innerHTML = 'Sign Up'
    signUpSubmitBtn.type = 'submit'
    main.style.filter = 'blur(8px)'
    body.style.overflowY = 'hidden'
    navbar.style.filter = 'blur(8px)'

    exitSignUpForm.addEventListener('click', () => {
        body.removeChild(signUpCover)
        main.style.filter = ''
        body.style.overflowY = ''
        navbar.style.filter = ''
    })

    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        let userObj = {
            username: signUpUsername.value,
            password: signUpPassword.value,
            email: signUpEmail.value,
            address: signUpAddress.value,
            city: signUpCity.value,
            zip: signUpZip.value
        }
        try {
            let response = await fetch("http://localhost:3000/register", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userObj)
            })
            let result = await response.json()
            console.log(result)
            if (response.status == 401) {
                errorMsg.innerText = result;
                return
            } else {
                setTimeout(() => {
                    location.reload()
                }, 1000)
            }
        } catch (err) {
            console.error(err);
        }

        
      

    })

}

const signInForm = () => {

    const signInFormCon = document.createElement('div'),
        signInCover = document.createElement('div'),
        signInForm = document.createElement('form'),
        signInUsername = document.createElement('input'),
        signInPassword = document.createElement('input'),
        signInSubmitBtn = document.createElement('button'),
        exitSignInFormCon = document.createElement('div'),
        exitSignInForm = document.createElement('div'),
        errorMsg = document.createElement('p')

    errorMsg.classList.add('errorMsg')
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
    signInForm.append(signInUsername, signInPassword, errorMsg, signInSubmitBtn)

    exitSignInForm.innerText = '❌'
    signInUsername.placeholder = 'Email'
    signInUsername.pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
    signInPassword.placeholder = 'Password'
    signInPassword.type = 'Password'
    signInUsername.type = 'email'
    signInUsername.setAttribute('required', '')
    signInPassword.setAttribute('required', '')
    signInSubmitBtn.innerHTML = 'Sign In'
    main.style.filter = 'blur(8px)'
    body.style.overflowY = 'hidden'
    navbar.style.filter = 'blur(8px)'

    exitSignInForm.addEventListener('click', () => {
        body.removeChild(signInCover)
        main.style.filter = ''
        body.style.overflowY = ''
        navbar.style.filter = ''
    })

    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        let userObj = {
            email: signInUsername.value,
            password: signInPassword.value
        }

        try {
            let response = await fetch("http://localhost:3000/login", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userObj)
            })
            let result = await response.json()
            if (response.status == 401) {
                errorMsg.innerText = result;
                return
            } else {
                setTimeout(() => {
                    location.reload()
                }, 1000)
            }
        } catch (err) {
            console.error(err);
        }

    })
}


signInBtn.addEventListener('click', signInForm)

signUpBtn.addEventListener('click', signUpForm)

signOutBtn.addEventListener('click', () => {
    fetch("http://localhost:3000/logout", {
        method: "DELETE",
    })
        .then(res => res.json())
        .then((data) => console.log(data))
    localStorage.clear()
    window.location.href = 'http://localhost:3000'
})

userBtn.addEventListener('click', () => {
    userStuff.style.display = 'flex'

})
userStuffClose.addEventListener('click', () => {
    userStuff.style.display = 'none'
})
myOrder.addEventListener('click', () => {

    window.location.href = "http://localhost:3000/myOrders.html"

})
async function makeRequest(url, method, body) {
    try {
        let response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body
        })
        let result = await response.json()
        return result;

    } catch (err) {
        console.error(err);
    }
}