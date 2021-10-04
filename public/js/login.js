const frmLogin = document.getElementById('login')
frmLogin.addEventListener('submit', login)

/*const btnRegister = document.getElementById('register')
btnRegister.addEventListener('click', register)

async function register(event) {
    // prevent default not reload page
    event.preventDefault();
    window.location.replace('/register');

}
*/

async function login(event) {
    // prevent default not reload page
    event.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const room = document.getElementById('room').value;

    const result = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            room,
        })
    }).then(res => res.json())

    if (result.status === 'ok') {
        // everything went fine
        console.log('success login') //, result.session.userId);

        window.location.replace('/chat');
    } else {
        alert(result.error)
    }
}



