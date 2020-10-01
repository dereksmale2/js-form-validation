let form = document.querySelector("#parking-form");
let formIsValid;

form.addEventListener("submit", validateForm);

function validateForm(event) {
    event.preventDefault();
    let name = event.target[0].value;
    let date = event.target[4].value;
    let days = event.target[5].value;
    let creditCard = event.target[6].value;
    let cvv = event.target[7].value;
    console.log(event)

    formIsValid = true;
    errorMessage("");

    validateCVV(cvv);
    validateCardNumber(creditCard);

    if (formIsValid) {
    fetch("https://momentum-server.glitch.me/parking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: { name } }),
    })
        .then((res) => res.json())
        .then((data) => {
        let total = document.querySelector("#total");
        let amount = 0;
        days = parseInt(days);

        date = moment(date).format("YYYY-MM-DD");
        let startDate = moment(date);
        let endDate = moment(startDate).add(days, "days");

        let loopDate = startDate;

        while (loopDate.format("M/D/YYYY") !== endDate.format("M/D/YYYY")) {
            let weekday = moment(loopDate).weekday();

            if (weekday === 6 || weekday === 0) {
            amount += 7;
            } else {
            amount += 5;
            }

            loopDate.add(1, "days");
        }

        total.innerHTML = amount;
        })
        .catch((err) => {
        console.log("error: ", err);
        errorMessage("Something went wrong. Please try again.");
        });
    }
}

function validateCardNumber(number) {
    let regex = new RegExp("^[0-9]{16}$");
    if (!regex.test(number)) {
    formIsValid = false;
    errorMessage("Credit card was not valid");
    }
    return luhnCheck(number);
}

function luhnCheck(val) {
    let sum = 0;
    for (let i = 0; i < val.length; i++) {
    let intVal = parseInt(val.substr(i, 1));
    if (i % 2 == 0) {
      intVal *= 2;
        if (intVal > 9) {
        intVal = 1 + (intVal % 10);
        }
    }
    sum += intVal;
    }
    return sum % 10 == 0;
}

function validateCVV(number) {
    let regex = new RegExp("^[0-9]{3}$");
    if (!regex.test(number)) {
    formIsValid = false;
    errorMessage("CVV was not valid");
    }
}

function errorMessage(message) {
    let errorDiv = document.querySelector("#error-msg");
    if (errorDiv) {
    errorDiv.innerHTML = message;
    }
}
