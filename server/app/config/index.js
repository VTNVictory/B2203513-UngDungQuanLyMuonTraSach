const config = {
  app: {
    port: process.env.PORT || 3000,
  },

  db: {
    uri:
      process.env.MONGODB_URI ||
      "mongodb+srv://nghinghi444:Nghinghi444@cluster0.jsx1t.mongodb.net/quanlymuonsach",
  },
};

module.exports = config;
