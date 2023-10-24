const cookieOptions = {
    maxAge: process.env.COOKIE_MAX_AGE,
    httpOnly: true,
    secure: true,
    sameSite: "None",
};

export default cookieOptions;
