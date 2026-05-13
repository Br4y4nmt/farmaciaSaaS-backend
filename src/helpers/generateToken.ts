import jwt from "jsonwebtoken";

const generateToken = (
  payload: object
) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;