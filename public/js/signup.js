async function signup(event) {
    event.preventDefault()
    try {
        let name = event.target.name.value;
        let email = event.target.email.value;
        let number = event.target.number.value;
        let password = event.target.password.value;
        let confirm = event.target.confirm.value;
        let obj = { name, email, number, password, confirm }
        let response = await axios.post('http://localhost:4000/user/signup', obj)
        if (response.status === 201) {
            alert(response.data.message)
            window.location.href = '/login'
        }
    } catch (err) {
        document.body.innerHTML += `${err.message}`
    }
}