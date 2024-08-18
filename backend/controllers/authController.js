

const userSignUp = (req, res) => {
    res.json({ msg: "sign up" })
}

const userLogIn = (req, res) => {
    res.json({ msg: "login" })
}

const userLogOut = (req, res) => {
    res.json({ msg: "logout" })
}

export {
    userSignUp,
    userLogIn,
    userLogOut
}