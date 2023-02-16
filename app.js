const express = require("express");
require("dotenv").config(); // to get stuff from .env file
//const https = require("https");
// require("body-parser") express has its own as of now
// intent was to use Heroku but that shit expensive
// so we instead use Railway i guess
// we also use Mailchimp
const mailChimp = require("@mailchimp/mailchimp_marketing");

// starting express 
const app = express();
app.use(express.static("public")); // we can use static files relative to url
app.use(express.urlencoded({extended: true})); // we gain access to body parser

mailChimp.setConfig({
    apiKey: process.env.MY_API_KEY,
    server: process.env.MY_SERVER,
});


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
    // we deliver file this when requested from server
});


// request data from client request and addint it to mailchimp
app.post("/", function (req, res) {
    
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const listId = process.env.MY_LIST_ID;

    async function run() {
        try {
        const response = await mailChimp.lists.addListMember(listId, {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        });

        console.log(`Succesfully added contact as an audience member. Id is ${response.id}`)
        res.sendFile(__dirname + "/success.html");
    } catch (exception) {
        console.log(exception);
        res.sendFile(__dirname + "/failure.html");
        }
}

run();

});

app.listen(process.env.PORT || 3000, function() {
    // process.env.PORT so we can host on a server :D
    console.log("Server running at " + process.env.PORT);
});
