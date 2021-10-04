
const registerForm = document.getElementById('reg-form')
registerForm.addEventListener('submit', register)

/*
const btnLogin = document.getElementById('login')
btnLogin.addEventListener('click', login)

async function login(event) {
    // prevent default not reload page
    event.preventDefault();
    window.location.replace('/login');

}
*/

// Register submit
//registerForm.addEventListener('submit', async (e) => {
async function register(event) {
    // prevent default not display a file
    event.preventDefault();

    // 1. Send data as JSON
    // 2. Send data as urlencoded (we use that when using form data) (used in php)
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json())

    // console.log(result);
    if(result.status === 'ok') {
        // everything went fine
        console.log('Success register');
        window.location.replace('/login');
    } else {
        alert(result.error);
    }
}
