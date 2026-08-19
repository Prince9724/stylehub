import jwt from 'jsonwebtoken';

const generateToken = (
  id,
  role,
  expiresIn = '15d',
  sessionId = null
) => {

  const payload = {
    id,
    role
  };

  // Only admin session gets sessionId
  if (sessionId) {
    payload.sessionId = sessionId;
  }

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn
    }
  );
};

export default generateToken;