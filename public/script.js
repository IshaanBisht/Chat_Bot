let closedlock = document.getElementById("closedlock");
let password = document.getElementById("password");

closedlock.onclick = function () {
    if (password.type == "password") {
        password.type = "text";
        closedlock.src = "image/bxs-lock-open.svg";
    } else {
        password.type = "password";
        closedlock.src = "image/bxs-lock.svg";
    }
};

const submitButton = document.querySelector('button[type="submit"]');

document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault();  // Prevent form from submitting traditionally

    submitButton.disabled = true;  // Disable the button

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Check if any required field is empty
    if (!data.fName || !data.lName || !data.email || !data.password) {
        alert("Please fill in all required fields.");
        submitButton.disabled = false;  // Re-enable the button
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.status === 201) {
            // Registration successful
            alert("Registration successful!");
        } else {
            // Display error message
            alert(result.error || "Something went wrong!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during registration!");
    } finally {
        submitButton.disabled = false;  // Re-enable the button after submission
    }
});



