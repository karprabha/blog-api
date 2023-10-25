const cookieOptions = {
    maxAge: process.env.COOKIE_MAX_AGE,
    httpOnly: true,
    secure: true,
    sameSite: "none",
};

export default cookieOptions;
