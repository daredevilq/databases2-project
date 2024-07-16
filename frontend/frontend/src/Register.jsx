import { useRef, useState, useEffect } from "react";
import {
    faCheck,
    faTimes,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import CONFIG from "./config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Register() {
    const REGISTER = "/register-user";
    const FIRSTNAME_LASTNAME_REGEX = /^[A-Z][a-z]{1,24}$/;
    const PASSWORD_REGEX =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    const EMAIL_REGEX = /^[A-Za-z][A-Za-z0-9]{1,13}@[a-z]{1,12}\.[a-z]{1,4}$/;
    const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9]{2,24}$/;
    const STREET_REGEX = /^[A-Z][A-Za-z]{2,24}$/;
    const SUITE_REGEX = /[A-Za-z0-9]{1,24}$/;
    const CITY_REGEX = /[A-Z][a-z]{1,24}$/;
    const ZIPCODE_REGEX = /^.{0,15}$/;
    const PHONE_REGEX = /^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/;

    const [success, setSuccess] = useState(false);

    const [firstname, setFirstname] = useState("");
    const [validFirstname, setValidFirstname] = useState(false);
    const [firstnameFocus, setFirstnameFocus] = useState(false);

    const [lastname, setLastname] = useState("");
    const [validLastname, setValidLastname] = useState(false);
    const [lastnameFocus, setLastnameFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [passworMatch, setPasswordMatch] = useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [emailTaken, setEmailTaken] = useState(false);

    const [country, setCountry] = useState("");
    const [validCountry, setValidCountry] = useState(false);
    const [countryFocus, setCountryFocus] = useState(false);

    const [street, setStreet] = useState("");
    const [validStreet, setValidStreet] = useState(false);
    const [streetFocus, setStreetFocus] = useState(false);

    const [suite, setSuite] = useState("");
    const [validSuite, setValidSuite] = useState(false);
    const [suiteFocus, setSuiteFocus] = useState(false);

    const [city, setCity] = useState("");
    const [validCity, setValidCity] = useState(false);
    const [cityFocus, setCityFocus] = useState(false);

    const [zipCode, setZipCode] = useState("");
    const [validZipCode, setaValidZipCode] = useState(false);
    const [zipCodeFocus, setZipCodeFocus] = useState(false);

    const [phone, setPhone] = useState("");
    const [validPhone, setValidPhone] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [isOk, setIsOk] = useState(false);

    useEffect(() => {
        const result = FIRSTNAME_LASTNAME_REGEX.test(firstname);
        setValidFirstname(result);
    }, [firstname]);

    useEffect(() => {
        const result = FIRSTNAME_LASTNAME_REGEX.test(lastname);
        setValidLastname(result);
    }, [lastname]);

    useEffect(() => {
        const result = USERNAME_REGEX.test(username);
        setValidUsername(result);
    }, [username]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);

        if (result) {
            const checkIfEmailIsTaken = async () => {
                try {
                    const response = await fetch(
                        `${CONFIG.API_URL}/check-email`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ email: email }),
                        }
                    );

                    if (response.status === 404) {
                        setEmailTaken(false);
                    } else if (response.status === 201) {
                        setEmailTaken(true);
                    } else {
                        console.error(
                            "Unexpected response status:",
                            response.status
                        );
                    }
                } catch (error) {
                    console.error("Error checking email:", error);
                }
            };

            checkIfEmailIsTaken();
        }
    }, [email]);

    useEffect(() => {
        const result = PASSWORD_REGEX.test(password);
        setPasswordMatch(password === confirmPassword);
        setValidPassword(result);
    }, [password, confirmPassword]);

    useEffect(() => {
        const result = CONFIG.COUNTRIES.includes(country);
        setValidCountry(result);
    }, [country]);

    useEffect(() => {
        const result = STREET_REGEX.test(street);
        setValidStreet(result);
    }, [street]);

    useEffect(() => {
        const result = SUITE_REGEX.test(suite);
        setValidSuite(result);
    }, [suite]);

    useEffect(() => {
        const result = CITY_REGEX.test(city);
        setValidCity(result);
    }, [city]);

    useEffect(() => {
        const result = ZIPCODE_REGEX.test(zipCode);
        setaValidZipCode(result);
    }, [zipCode]);

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        setValidPhone(result);
    }, [phone]);

    useEffect(() => {
        const result =
            validFirstname &&
            validLastname &&
            validUsername &&
            validEmail &&
            validPassword &&
            passworMatch &&
            validCountry &&
            validStreet &&
            validSuite &&
            validCity &&
            validZipCode &&
            validPhone;

        setIsOk(result);
    }, [
        validFirstname,
        validLastname,
        validUsername,
        validEmail,
        validPassword,
        passworMatch,
        validCountry,
        validStreet,
        validSuite,
        validCity,
        validZipCode,
        validPhone,
    ]);

    function handleSubmit(event) {
        event.preventDefault(); //prevents from page reload

        if (isOk) {
            const createUser = async () => {
                try {
                    const response = await fetch(
                        `${CONFIG.API_URL}${REGISTER}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                firstname: firstname,
                                lastname: lastname,
                                username: username,
                                email: email,
                                password: password,
                                country: country,
                                street: street,
                                suite: suite,
                                city: city,
                                zipcode: zipCode,
                                phone: phone,
                            }),
                        }
                    );

                    if (response.status === 201) {
                        setSuccess(true);
                    } else if (response.status === 500) {
                        setSuccess(false);
                    } else {
                        console.error(
                            "Unexpected response status:",
                            response.status
                        );
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            };

            createUser();
        } else {
            alert("Please fill in all fields correctly.");
        }
    }

    return (
        <>
            <h1>Register</h1>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="firstname">Firstname:</label>
                        <input
                            type="text"
                            id="firstname"
                            value={firstname}
                            required
                            onFocus={() => setFirstnameFocus(true)}
                            onBlur={() => setFirstnameFocus(false)}
                            autoComplete="off"
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                        {firstname &&
                            (validFirstname ? (
                                <p>Valid firstname</p>
                            ) : (
                                <p>Invalid firstname</p>
                            ))}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastname">Lastname:</label>
                        <input
                            type="text"
                            autoComplete="off"
                            id="lastname"
                            required
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />

                        {lastname &&
                            (validLastname ? (
                                <p>Valid lastname</p>
                            ) : (
                                <p>Invalid lastname</p>
                            ))}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            autoComplete="off"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {username &&
                            (validUsername ? (
                                <p>Valid username</p>
                            ) : (
                                <p>Invalid username</p>
                            ))}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {email &&
                            (emailTaken ? (
                                <p>This email is taken, please log in</p>
                            ) : validEmail ? (
                                <p>Valid Email</p>
                            ) : (
                                <p>Invalid email</p>
                            ))}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            autoComplete="off"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {password &&
                            (validPassword ? (
                                <p>Valid password</p>
                            ) : (
                                <p>
                                    Password must contain minimum 8 signs,
                                    minimum one capital letter, number and
                                    special sign{" "}
                                </p>
                            ))}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            autoComplete="off"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPassword &&
                            (passworMatch ? (
                                <p>passwords match</p>
                            ) : (
                                <p>passwords do not match</p>
                            ))}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            autoComplete="off"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                        {country &&
                            (validCountry ? (
                                <p>Country is valid</p>
                            ) : (
                                <p>Country is invalid</p>
                            ))}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="street">Street</label>
                        <input
                            type="text"
                            autoComplete="off"
                            id="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />

                        {street &&
                            (validStreet ? (
                                <p>Street is valid</p>
                            ) : (
                                <p>Street is invalid</p>
                            ))}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="suite">Suite</label>
                        <input
                            type="text"
                            autoComplete="off"
                            id="suite"
                            value={suite}
                            onChange={(e) => setSuite(e.target.value)}
                        />

                        {suite &&
                            (validSuite ? (
                                <p>Suite is valid</p>
                            ) : (
                                <p>Suite is invalid</p>
                            ))}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            autoComplete="off"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />

                        {city &&
                            (validCity ? (
                                <p>City is valid</p>
                            ) : (
                                <p>City is invalid</p>
                            ))}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="zipCode">ZipCode</label>
                        <input
                            type="text"
                            autoComplete="off"
                            id="zipCode"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />

                        {zipCode &&
                            (validZipCode ? (
                                <p>ZipCode is valid</p>
                            ) : (
                                <p>ZipCode is invalid</p>
                            ))}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="text"
                            autoComplete="off"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        {phone &&
                            (validPhone ? (
                                <p>Phone is valid</p>
                            ) : (
                                <p>Phone is invalid</p>
                            ))}
                    </div>
                    <button type="submit">Register</button>
                    <p>
                        Already registered?
                        <br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="#">Sign In</a>
                        </span>
                    </p>
                </form>
            )}
        </>
    );
}

export default Register;
