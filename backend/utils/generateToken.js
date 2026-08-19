import jwt from 'jsonwebtoken';

const generateToken = (id, role, expiresIn, sessionId = null) => {
  return jwt.sign(
    {
      id,
      role,
      sessionId
    },
    process.env.JWT_SECRET,
    {
      expiresIn: expiresIn || process.env.JWT_EXPIRE || '7d'
    }
  );
};

export default generateToken;