const db = require ('../config/db');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
require("dotenv").config();

//register a user
exports.registerUser = async(req, res)=> {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({message:"Please correct input errors", errors: errors.array()});
    }
    const{name, email, password} = req.body

    try {
       const [users] = await db.execute("SELECT email FROM users WHERE email = ?",[email] );
       
       if(users.length > 0){
        return res.status(400).json({message: "User already exists"})
       }

       const hashedPassword = await bcrypt.hash(password, 10)

       await db.execute(
        "INSERT INTO users(name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]
       );
       return res.status(201).json({message:"User registed Successfully!"});
    } catch (error) {
        console.error(error);

        res.status(500).json({message: "An error occured during registration", error: error.message,})
    }
};

//Login
exports.loginUser = async (req, res) => {
    const {email, password } = req.body

    try {
        //check if user exist
    const [user] = await db.execute("SELECT user_id, name, email, password FROM users WHERE email = ?", [email]);
    
    console.log ({user});

    if (user.length === 0){
        return res.status(400).json({ message: "The user does not exist"})
    }
     const isMatch = await bcrypt.compare(password, user[0].password);

     if(!isMatch){
        return res.status(400).json({message: "Invalid email/password"})
     }

//create JWTs
//access token
const accessToken = jwt.sign(
    {user_id: user[0].user_id, email: user[0].email},
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: "15m"}
);
console.log("Access token is:", accessToken)

//refresh token
const refreshToken = jwt.sign(
    {user_id: user[0].user_id, email: user[0].email},
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: "1d"}
);

//Saving refresh token in the database
const [saveTokens] = await db.execute(
    "INSERT INTO refresh_tokens(user_id, refreshToken)VALUES(?, ?)",
    [user[0].user_id, refreshToken]
);
console.log("Refresh token saved:", saveTokens);

res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
});
return res.status(200).json({
user: {
    user_id: user[0].user_id,
    name: user[0].name,
    email: user[0].email,
}

});

} catch (error) {
        console.error(error);
        res.status(500).json({message: "An error occured during login", error: error.message});
    }
};

//refresh endpoint that receoves the refreshtoken form cookie, verifies it and issues a new access token
//Frontend should call this endpoint when the access token expires

exports.refreshToken = async (req, res) => {

const refreshToken = req.cookies?.jwt; //req.cookies contains all the cookies sent by the client and cookies?.jwt checks if there is a jwt cookie.

if (!refreshToken) {
    console.log("Cookies received:", req.cookies);
    return res.status(401).json({ message: "No refresh token found" });
}


try {
    // Check if refresh token exists in the database
    const [tokenResult] = await db.execute(
        "SELECT * FROM refresh_tokens WHERE refreshToken = ?",
        [refreshToken]
      );
  
      if (tokenResult.length === 0) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
  
      // Verify refresh token
     const decodedData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        
        const [userResult] = await db.execute(
            "SELECT user_id, name, email FROM users WHERE user_id = ?",
            [decodedData.user_id]
          );
        
          if (userResult.length === 0) {
            return res.status(404).json({ message: "User not found" });
          }
        
          const user = userResult[0]; // Get user details from the result

        // Generate a new access token
        const accessToken = jwt.sign(
          { user_id: decodedData.user_id, email: decodedData.email},
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
  
        res.json({
        accessToken,
        user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email
        }
            
            });
    
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error refreshing token" });
}

}

exports.logoutUser = async (req, res) => {
  
  //verify if jwt cookie exist in the request
  const cookies = req.cookies;
  if(!cookies?.jwt){
    
    return res.status(200).json({ message: "No token to clear, already logged out" });

};

  const refreshToken = cookies.jwt;

  try {
    //Is refreshToken in db?
    const[tokens]= await db.execute('SELECT * FROM refresh_tokens WHERE refreshToken =?', [refreshToken])
    if(tokens.length === 0){
      res.clearCookie('jwt',{httpOnly:true, sameSite: 'None', secure:true});
      return res.status(200).json({ message: "Token not found, cookie cleared" });
    }

    //Delete refreshtokens in db
    await db.execute('DELETE FROM refresh_tokens WHERE refreshToken=?',[refreshToken])
  
    res.clearCookie('jwt',{httpOnly:true, sameSite: 'None', secure:true});
   return res.status(200).json({ message: "Logged out successfully" })
  
  } catch (error) {
   console.error('Error during logout:', error);
   return res.status(500);//Internal server error 
  }
};

