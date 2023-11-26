const addAuthCookie = function (token, res) {
  
    const cookieExpireDate = new Date(
        Date.now() + process.env.TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
    );
  
    res.cookie('token', token, {
        expiresIn: cookieExpireDate,
        httpOnly: true, //cookie cannot be accessed by client side js
    });
    return res;
};
export default addAuthCookie;
