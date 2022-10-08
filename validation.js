function Validator(form) {

    let formRules = {};
    let validateRules = {
        required(value) {
            return value ? undefined : "Please complete this field";
        },
        email(value) {
            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(value) ? undefined : "Email adress is invalid";
        },
        min(min) {
            return function (value) {
                return value.length >= min ? undefined : `Use at least ${min} charaters`;
            }

        },
        confirm(value) {
            let pw = formElement.querySelector('#password').value;
            return value === pw ? undefined : "Your password confirmation does not match";
        }
    };

    let formElement = document.querySelector(form);

    if (formElement) {

        let inputs = formElement.querySelectorAll('[name][rules]')
        let hasError = 0;

        const deleteMess = function (event) {
            let input = event.target;
            getParent(input, '.form-group').querySelector('.form-message').innerText = null;
        }
        const getParent = function (input, parentSelector) {
            while (input.parentElement) {
                if (input.parentElement.matches(parentSelector)) {
                    return input.parentElement;
                }
                input = input.parentElement;
            }
        }
        let errorMess = true;
        const handleValidate = function (event) {
            let input = event.target
            for (let error of formRules[input.name]) {
                errorMess = error(input.value);
                if (errorMess) {
                    hasError++;
                    return getParent(input, '.form-group').querySelector('.form-message').innerText = errorMess;
                }
            }
        }

        for (let input of inputs) {

            let rules = input.getAttribute('rules').split('|');
            for (let rule of rules) {

                if (rule.includes(':')) {
                    let ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                    validateRules[rule] = validateRules[rule](ruleInfo[1]);
                }

                if (!Array.isArray(formRules[input.name])) {
                    formRules[input.name] = [];
                }

                if (validateRules[rule]) {
                    formRules[input.name].push(validateRules[rule]);
                }

            }

            input.onblur = handleValidate;
            input.oninput = deleteMess;
        }

        let agreeBtn = formElement.querySelector('#agree-btn')
        let submitBtn = formElement.querySelector('#submit-btn')
        const allowSubmit = function () {
            if (agreeBtn.checked) {
                submitBtn.classList.add('allowed');
                submitBtn.onclick = (event) => {
                    hasError = 0;
                    inputs.forEach(input => {
                        input.focus();
                        input.blur();
                    });
                    if (hasError) {
                        event.preventDefault();
                    }
                }
                return
            }

            submitBtn.classList.remove('allowed');
            submitBtn.onclick = (event) => {
                event.preventDefault()
            }
        }
        agreeBtn.onclick = allowSubmit
        submitBtn.onclick = (event) => {
            event.preventDefault()
        }
    }
}