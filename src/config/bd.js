const mongoose = require("mongoose")


mongoose
  .connect("mongodb+srv://root:root@cluster0.keede.mongodb.net/prettyDb?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {console.log('Connection REUSSI')})
  .catch(err => console.error("Connection error", err));

module.exports = mongoose;