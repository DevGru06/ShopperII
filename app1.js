//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
// const _ = require('lodash');
const mongoose = require("mongoose");

const DB = require(__dirname + "/data.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//**********************************************************************
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const viewState = [];
// {
// title:
// alert:
// btOne = {
//     button: 
//     buttonLink:
//     buttonTitle:
// }
// btOne = {
//     button:
//     buttonLink:
//     buttonTitle:
// }
// bdList:
// List:
// }

// all to add an item
var newTitle = "";
var itemToAdd = "";
var listtoAdd = [];

// // the database
// var itemList = [];
// var mainList = [];

// errors
var alertTitle = "";
var alertMessage = "";

var displayList = [];
// var badgeList = [];
// var useChecked = true;

// const buttonOne = {
//   button: true,
//   buttonLink: "/menu",
//   buttonTitle: "Confirm",
// }
// const buttonTwo = {
//   button: true,
//   buttonLink: "/menu",
//   buttonTitle: "Back",
// }

//**********************************************************************
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Site Started Started Successfully");
  DB.BeginServer();
});

//**********************************************************************
app.get("/error", function(req, res) {
  res.render("error.ejs", {
    title: "Bock-b-gock",
    button: false,
    buttonLink: "",
    buttonTitle: "",
  });
});

app.get("/", function(req, res) {
  res.render("login.ejs");
});

app.get("/signin", function(req, res) {

  // const user = new User({
  //   username: req.body.username,
  //   password: req.body.password
  // });
  //
  // req.login(user, function(err) {
  //   if(err){
  //     console.log(err);
  //   } else {
  //     passport.authenticate("local")(req, result, function(){
  //       res.redicrect("/secrets");
  //     })
  //   }
  // })

  res.render("signin.ejs");
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res) {
  res.render("register.ejs");
  // User.register({username: req.body.username}, req.body.password, function(err, user) {
  //   if(err){************************************************
  //     console.log(err);
  //     res.redirect("/register");
  //   }else {
  //     passport.authenticate("local")(req, res, function() {
  //       res.redirect("/secrets");
  //     });
  //   }
  // });*********************************************************
});

//**********************************************************************

app.all("/menu", function(req, res) {
  buttonOne.button = false;
  buttonTwo.button = false;
  res.render("menu.ejs", {
    title: "Menu",
    buttonOne: buttonOne,
    buttonTwo: buttonTwo
  });
});

//**********************************************************************

function DisplayList(res, dltitle, dlbadgelist, dlitemlist, dlusechecked) {
  // console.log(dlitemlist);
  res.render("list.ejs", {
    title: dltitle,
    buttonOne: buttonOne,
    buttonTwo: buttonTwo,
    badgelist: dlbadgelist,
    useChecked: dlusechecked,
    list: dlitemlist
  });
}

// app.all("/list", function(req, res) {
//   // if (req.isAuthenticated()){***********
//   //   res.render("/secrets");**********
//   // } else {***********
//   //   res.render("/login");*****************
//   // }
//   // var nt = "Bee-gock!";
//
//   // if (newTitle.length > 0) {
//   //   nt = newTitle;
//   // }
//   //
//   // if (listtoAdd.length > 0) {
//   //   badgeList = listtoAdd;
//   // }
//
//   // if (itemList.length > 0) {
//   //   displayList = itemList;
//   // }
//
//   // console.log(displayList);
//
//   res.render("list.ejs", {
//     title: newTitle,
//     buttonOne: buttonOne,
//     buttonTwo: buttonTwo,
//     badgelist: badgeList,
//     useChecked: useChecked,
//     list: displayList
//   });
// });

//**********************************************************************


app.all("/title", function(req, res) {
  buttonOne.button = true;
  buttonOne.buttonLink = "/menu";
  buttonOne.buttonTitle = "Back";
  buttonTwo.button = false;

  res.render("title.ejs", {
    title: "Title",
    buttonOne: buttonOne,
    buttonTwo: buttonTwo
  });
});

app.post("/title/itemlist", function(req, res) {
  const selection = req.body.title;
  console.log("selection", selection);

  if (selection.length <= 1) {
    buttonOne.button = true;
    buttonOne.buttonTitle = "Back";
    buttonOne.buttonLink = "/title"

    alertTitle = "Alert";
    alertMessage = "Title " + selection + " is too short";

    // ResError(res, "Alert", "Title " + selection + " is too short", "/title");
    res.redirect("/alert");
  } else {
    // console.log("selection", selection);

    DB.Lists.find({
      name: selection
    }, function(err, ids) {
      if (ids.length != 0) {
        // alert("List already exists with that Title");
        console.log("todo: test with a redirect");
        // todo: test with a redirect
      } else {
        // newTitle = selection;
        // displayList = itemList;
        // res.redirect("/list");
        console.log(itemList);
        DisplayList(res, selection, null, DB.itemL, true)
      }
    });
  }
});

//**********************************************************************

app.get("/activelist", function(req, res) {
  // console.log("mainList.length", mainList.length);
  // console.log("mainList.length", mainList.length);
  if (DB.mainL.length > 0) {
    buttonOne.button = true;
    buttonOne.buttonTitle = "Back";
    buttonOne.buttonLink = "/menu"

    buttonTwo.button = true;
    buttonTwo.buttonTitle = "Refresh";
    buttonTwo.buttonLink = "/save/refresh";

    displayList.length = 0;
    DB.mainL.forEach(function(i) {
      displayList.push(i.name);
      console.log("i.name", i.name);
    });

    res.render("altlist.ejs", {
      title: "Shopping List",
      buttonOne: buttonOne,
      buttonTwo: buttonTwo,
      // badgelist: null,
      // useChecked: false,
      list: displayList
    });
  } else {
    // alert no lists found

    buttonOne.button = true;
    buttonOne.buttonTitle = "Back";
    buttonOne.buttonLink = "/menu"

    alertTitle = "Alert";
    alertMessage = "No Active Lists";

    // ResError(res, "Alert", "Title " + selection + " is too short", "/title");
    res.redirect("/alert");

    // ResError(res, "Alert", "No Active Lists", "/menu");
  }
});

//**********************************************************************

app.get("/lists/:which", function(req, res) {
  const which = req.params.which;

  DB.mainL.find(function(idx) {
    if (idx.name === which) {
      newTitle = which;
      buttonOne.button = true;
      buttonOne.buttonTitle = "Back";
      buttonOne.buttonLink = "/menu"

      buttonTwo.button = true;
      buttonTwo.buttonTitle = "Edit";
      buttonTwo.buttonLink = "/list/edit"

      // console.log("idx.listitem", idx.listitem);
      DisplayList(res, which, null, idx.listitem, false);
      // displayList = idx.listitem;
      //
      // newTitle = which;
      // listtoAdd.length = 0;
      //
      // buttonOne.button = true;
      // buttonOne.buttonTitle = "Back";
      // buttonOne.buttonLink = "/menu"
      //
      // buttonTwo.button = true;
      // buttonTwo.buttonTitle = "Edit";
      // buttonTwo.buttonLink = "/list/edit"
      //
      // res.redirect("/list");
    }
  });
});

app.get("/list/edit", function(req, res) {
  DB.mainL.find(function(idx) {
    if (idx.name === newTitle) {

      buttonOne.button = true;
      buttonOne.buttonTitle = "Back";
      buttonOne.buttonLink = "#" // back to list display

      buttonTwo.button = true;
      buttonTwo.buttonTitle = "Save";
      buttonTwo.buttonLink = "#" // this gets called somewhere else, but needs to update, new function?

      console.log("idx.listitem", idx.listitem);

      const templist = DB.itemL;
      templist.forEach(function(cl) {
        idx.listitem.forEach(function(bdg) {
          if (bdg.item === cl.item) {
            console.log("bdg.item",bdg.item);
            cl.checked = true;
          }
        });
      });

      // console.log("idx.listitem", idx.listitem);
      DisplayList(res, newTitle, idx.listitem, templist, true);
    }
  });
});

//**********************************************************************

app.post('/item/add', function(req, res) {
  const selection = req.body.checkbox;

  if (selection.length > 0) {
    itemList.find(function(found) {
      // console.log("selection", selection);

      if (found._id == selection) {
        found.checked = true;
        itemToAdd = found.item;
        res.redirect("/item/quantity");
      } else {
        // console.log("ADD", "didnt find it");
        // res.redirect("/list");
      }
    });
    // } else {
    //   res.redirect("/list");
  }
});

app.get("/item/quantity", function(req, res) {

  buttonOne.button = true;
  buttonOne.buttonTitle = "Back";
  buttonOne.buttonLink = "/list"

  buttonTwo.button = false;

  res.render("quantity.ejs", {
    title: itemToAdd,
    buttonOne: buttonOne,
    buttonTwo: buttonTwo,
    item: itemToAdd
  });
});

app.post("/item/newItem", function(req, res) {
  const qty = req.body.title;

  console.log("qty", qty);

  if (qty > 0) {

    // make entity to add to list
    const addvar = {
      item: itemToAdd,
      quantity: qty
    }

    listtoAdd.push(addvar);

  } else {
    console.log("Quantity was to low");

    ///****************** todo fix this, cant redirect from post to get
  }
  // call redirect back to full list

  buttonOne.button = true;
  buttonOne.buttonLink = "/menu";
  buttonOne.buttonTitle = "Menu";
  buttonTwo.button = true;
  buttonTwo.buttonLink = "/save/list";
  buttonTwo.buttonTitle = "Save";
  badgeList = listtoAdd;
  displayList = itemList;

  res.redirect("/list");
});

app.post("/save/list", function(req, res) {
  if (newTitle.length > 0 && listtoAdd.length > 0) {
    const newb = new MainList();

    newb.name = newTitle;
    newb.createdDate = Date.now();
    newb.checkedDate = new Date(1111, 11, 11)
    newb.closed = false;
    newb.listitem = listtoAdd;
    newb.save();
  }
  console.log("check it");
});

app.get("/save/refresh", function(req, res) {
  DBLoadMainList();
  FillMain();
  res.redirect("back");
});

app.get("/error/alert", function(req, res) {
  buttonTwo.button = false;

  res.render("alert.ejs", {
    title: alertTitle,
    buttonOne: buttonOne,
    buttonTwo: buttonTwo,
    alert: alertMessage
  });
});

app.post('/list/sortMe', function(req, res) {
  const col = req.body.title;
  // console.log("col", col);

  switch (col) {
    case "1":
      itemList.sort(function(a, b) {
        if (a.item < b.item) {
          return -1;
        }
        if (a.item > b.item) {
          return 1;
        }
        return 0;
      });
      break;
    case "2":
      itemList.sort(function(a, b) {
        if (a.type < b.type) {
          return -1;
        }
        if (a.type > b.type) {
          return 1;
        }
        if (a.item < b.item) {
          return -1;
        }
        if (a.item > b.item) {
          return 1;
        }
        return 0;
      });
      break;
      // default:
  }
  res.redirect("back");
});
