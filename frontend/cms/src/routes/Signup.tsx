import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const FIRSTNAME_REGEX = /^[A-Z][a-z]{1,23}$/;
const FAMILYNAME_REGEX = /^[A-Z][a-z]{1,23}$/;
const USERNAME_REGEX = /^[a-z][a-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const SUCCESS_REDIRECT_URL = "/login";
const API_URI = import.meta.env.VITE_API_URI;

const Signup = () => {
    const navigate = useNavigate();
    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLInputElement>(null);

    const [familyName, setFamilyName] = useState("");
    const [validFamilyName, setValidFamilyName] = useState(false);
    const [familyNameFocus, setFamilyNameFocus] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [validFirstName, setValidFirstName] = useState(false);
    const [firstNameFocus, setFirstNameFocus] = useState(false);

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setValidFirstName(FIRSTNAME_REGEX.test(firstName));
    }, [firstName]);

    useEffect(() => {
        setValidFamilyName(FAMILYNAME_REGEX.test(familyName));
    }, [familyName]);

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrorMessages([]);
    }, [firstName, familyName, username, pwd, matchPwd]);

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const user = {
            first_name: firstName,
            family_name: familyName,
            username: username,
            password: pwd,
        };

        try {
            const response = await fetch(`${API_URI}/api/v1/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                navigate(SUCCESS_REDIRECT_URL);
            } else {
                const { errors } = await response.json();

                const newErrorMessages = errors.map(
                    (error: { msg: string }) => error.msg
                );
                setErrorMessages(newErrorMessages);
                errRef.current?.focus();
            }
        } catch (error) {
            console.error(error);
            setErrorMessages(["An error occurred while signing up."]);
            errRef.current?.focus();
        }
    };

    return (
        <div className="flex my-20 items-center justify-center h-full bg-gray-100 mx-4">
            <div className="bg-white w-full max-w-sm box-border p-8 rounded-lg shadow-lg">
                <div ref={errRef}>
                    {errorMessages.map((errorMessage, index) => (
                        <p
                            key={index}
                            className="text-red-500 bg-red-100 p-2 rounded mb-4 text-center"
                            aria-live="assertive"
                        >
                            {errorMessage}
                        </p>
                    ))}
                </div>
                <h2 className="text-2xl text-center mb-4">Signup</h2>
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label
                            htmlFor="first_name"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            ref={userRef}
                            autoComplete="off"
                            name="first_name"
                            className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none ${
                                !validFirstName && firstName
                                    ? "border-red-500"
                                    : ""
                            }`}
                            placeholder="First Name"
                            required
                            aria-invalid={validFirstName ? "false" : "true"}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            onFocus={() => setFirstNameFocus(true)}
                            onBlur={() => setFirstNameFocus(false)}
                        />

                        <p
                            id="firstnamenote"
                            className={
                                firstNameFocus && firstName && !validFirstName
                                    ? "bg-red-100 text-red-500 text-sm rounded p-2 mt-2"
                                    : "sr-only"
                            }
                        >
                            Length: 2 to 24 characters.
                            <br />
                            Begin with a capital letter.
                            <br />
                            Use only alphabetic letters.
                        </p>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="family_name"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Family Name
                        </label>
                        <input
                            type="text"
                            id="family_name"
                            autoComplete="off"
                            name="family_name"
                            className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none ${
                                !validFamilyName && familyName
                                    ? "border-red-500"
                                    : ""
                            }`}
                            placeholder="Family Name"
                            required
                            aria-invalid={validFamilyName ? "false" : "true"}
                            value={familyName}
                            onChange={(e) => setFamilyName(e.target.value)}
                            onFocus={() => setFamilyNameFocus(true)}
                            onBlur={() => setFamilyNameFocus(false)}
                        />

                        <p
                            id="familynamenote"
                            className={
                                familyNameFocus && !validFamilyName
                                    ? "bg-red-100 text-red-500 text-sm rounded p-2 mt-2"
                                    : "sr-only"
                            }
                        >
                            Length: 2 to 24 characters.
                            <br />
                            Begin with a capital letter.
                            <br />
                            Use only alphabetic letters.
                        </p>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            autoComplete="off"
                            name="username"
                            className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none ${
                                !validUsername && username
                                    ? "border-red-500"
                                    : ""
                            }`}
                            placeholder="Username"
                            required
                            aria-invalid={validUsername ? "false" : "true"}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setUsernameFocus(true)}
                            onBlur={() => setUsernameFocus(false)}
                        />

                        <p
                            id="usernamenote"
                            className={
                                usernameFocus && !validUsername
                                    ? "bg-red-100 text-red-500 text-sm rounded p-2 mt-2"
                                    : "sr-only"
                            }
                        >
                            Length: 4 to 24 characters.
                            <br />
                            Start with a lowercase letter.
                            <br />
                            Lowercase, numbers, underscores, hyphens allowed.
                        </p>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none ${
                                !validPwd && pwd ? "border-red-500" : ""
                            }`}
                            placeholder="Password"
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />

                        <p
                            id="pwdnote"
                            className={
                                pwdFocus && !validPwd
                                    ? "bg-red-100 text-red-500 text-sm rounded p-2 mt-2"
                                    : "sr-only"
                            }
                        >
                            Length: 8-24 characters
                            <br />
                            Include both uppercase and lowercase letters, at
                            least one number, and a special character.
                            <br />
                            Allowed special characters:{" "}
                            <span aria-label="exclamation mark">!</span>
                            <span aria-label="at symbol">@</span>
                            <span aria-label="hashtag">#</span>
                            <span aria-label="dollar sign">$</span>
                            <span aria-label="percent">%</span>
                        </p>
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none ${
                                !validMatch && matchPwd ? "border-red-500" : ""
                            }`}
                            placeholder="Confirm Password"
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            value={matchPwd}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />

                        <p
                            id="confirmnote"
                            className={
                                matchFocus && !validMatch
                                    ? "bg-red-100 text-red-500 text-sm rounded p-2 mt-2"
                                    : "sr-only"
                            }
                        >
                            Must match the previous password input field.
                        </p>
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-md text-white ${
                            !validFirstName ||
                            !validFamilyName ||
                            !validUsername ||
                            !validPwd ||
                            !validMatch
                                ? "bg-gray-300 cursor-not-allowed opacity-50"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        disabled={
                            !validFirstName ||
                            !validFamilyName ||
                            !validUsername ||
                            !validPwd ||
                            !validMatch
                                ? true
                                : false
                        }
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-600 text-sm">
                    Already registered?{" "}
                    <span className="line">
                        <Link to={"/login"} className="text-blue-500">
                            Login
                        </Link>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Signup;
