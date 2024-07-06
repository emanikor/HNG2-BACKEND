require('dotenv').config(); // Load environment variables

const app = require('./app');
const sequelize = require('./models');

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.log(err.message);
});
