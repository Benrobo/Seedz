const ENV = {
  jwtSecret: process.env.JWT_SECRET,
  clientUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `https://seedz.vercel.app`,
  serverUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/api/graphql"
      : process.env.BACKEND_URL,
};

export default ENV;
