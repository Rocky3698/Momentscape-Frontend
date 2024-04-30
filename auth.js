const Registration = (event) => {
    event.preventDefault();
    const username = getValue("username");
    const first_name = getValue("firstname");
    const last_name = getValue("lastname");
    const email = getValue("email");
    const password = getValue("password");
    const confirm_password = getValue("confirm_password");
    const city = getValue("city");
    const street_address = getValue("street");
    const street_number = getValue("number");
    const postal_code = getValue("postal_code");
    const gender = getValue("gender");
    const dp = document.getElementById("image").files[0];
    const phone_number=getValue("phone");
    const country=getValue("country");
    const is_superuser = false;
    
    const user_info =
    {
        username,
        first_name,
        last_name,
        email,
        password,
        confirm_password,
        "dp":null,
        gender,
        phone_number,
        city,
        street_address,
        street_number,
        postal_code,
        country
    }

    console.log(user_info);
    if (password === confirm_password) {
        document.getElementById("error").innerText = "";
        console.log(user_info);
        fetch("http://127.0.0.1:8000/account/register/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(user_info),
        })
            .then((res) => res.json())
            .then((data) => console.log(data));
    } else {
        document.getElementById("error").innerText =
            "password and confirm password do not match";
        alert("password and confirm password do not match");
    }
};

const getValue = (id) => {
    const value = document.getElementById(id).value;
    return value;
};

const Login = (event) => {
    event.preventDefault();
    const username = getValue("login-username");
    const password = getValue("login-password");
    console.log(username, password);
    
    if (username && password) {
        fetch("http://127.0.0.1:8000/account/login/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.user_id) {
                    localStorage.setItem("user_id", data.user_id,"token",data.token);
                    window.location.href = "home.html";
                } else {
                    console.log("Invalid credentials or error occurred");
                }
            })
            .catch(error => {
                console.error("Error occurred during fetch:", error);
            });
    } else {
        console.log("Both username and password are required");
    }
};
