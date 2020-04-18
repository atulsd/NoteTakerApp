// Dependencies
var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Starts the server to begin listening
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
