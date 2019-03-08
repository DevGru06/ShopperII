//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
// const _ = require('lodash');
const mongoose = require("mongoose");

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
// const options = {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   autoIndex: false, // Don't build indexes
//   reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//   reconnectInterval: 500, // Reconnect every 500ms
//   poolSize: 10, // Maintain up to 10 socket connections
//   // If not connected, return errors immediately rather than waiting for reconnect
//   bufferMaxEntries: 0,
//   connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
//   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//   family: 4 // Use IPv4, skip trying IPv6
// };
//
// const LoadDB = function() { //REFACTOR ME TO MAKE PROMISE WORK RIGHT mongodb+srv://Admin:Royalty99@orderist-33pfq.mongodb.net/orderdb?retryWrites=true
//   return new Promise(function(resolve, reject) {
//     if (mongoose.connection.readyState === 0) {
//       mongoose.connect('mongodb+srv://Admin:' + process.env.PASSWORD + '@cluster0-k5alh.azure.mongodb.net/shopmedb?retryWrites=true', options).catch((err) => {
//         console.log(err.stack); //"Error Connecting to the Mongodb Database"
//       });
//       mongoose.set("useCreateIndex", true);
//
//       if (mongoose.connection.readyState === 0) {
//         reject("UN-Succesfully Connected to the Mongodb Database", null);
//       } else {
//         resolve(null, "Succesfully Connected to the Mongodb Database");
//       }
//     } else {
//       console.log("Already connected");
//     }
//   });
// };

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

// const itemSchema = new mongoose.Schema({
//   item: String,
//   type: String
// });
//
// const mainlistSchema = new mongoose.Schema({
//   name: String,
//   createdDate: Date,
//   checkedDate: Date,
//   closed: Boolean,
//   listitem: {}
// });
// const MainList = new mongoose.model("MainList", mainlistSchema);


// all to add an item
var newTitle = "";
var itemToAdd = "";
var listtoAdd = [];

// the database
const itemList = [];
const mainList = [];

// errors
var alertTitle = "";
var alertMessage = "";

var displayList = [];
var badgeList = [];
var useChecked = true;

const buttonOne = {
  button: true,
  buttonLink: "/menu",
  buttonTitle: "Confirm",
}
const buttonTwo = {
  button: true,
  buttonLink: "/menu",
  buttonTitle: "Back",
}

// //**********************************************************************
//
// const DBLoadItem = function() {
//   return new Promise(function(resolve, reject) {
//     Item = mongoose.model("items", itemSchema);
//     if (Item.length > 0) {
//       // console.log("Item", Item);
//       resolve(null, "[Item " + Item.length + "]");
//     } else {
//       // console.log("Item", Item);
//
//       reject("Item Failed", null);
//     }
//   });
// }
//
// const DBLoadMainList = function() {
//   return new Promise(function(resolve, reject) {
//     MainList = new mongoose.model("MainList", mainlistSchema);
//     if (MainList.length > 0) {
//       // console.log("Item", Item);
//       resolve(null, "[MainList " + MainList.length + "]");
//     } else {
//       // console.log("MainList", MainList);
//
//       reject("MainList Failed", null);
//     }
//   });
// }
//
// function FillMain() {
//   return new Promise(function(resolve, reject) {
//     MainList.find({}, function(err, ids) {
//       // console.log('ids', ids.length);
//
//       if (ids.length != 0) {
//         ids.forEach(function(i) {
//           // console.log('i', i);
//           // console.log('i.item', i.item);
//           // console.log('i.type', i.type);
//
//           const mulval = {
//             name: i.name,
//             createdDate: i.createdDate,
//             checkedDate: i.checkedDate,
//             closed: i.closed,
//             listitem: i.listitem
//             // {
//             //   item: String,
//             //   qty: Number
//             // }
//           }
//           // console.log('mulval', mulval);
//
//           mainList.push(mulval);
//         });
//         // mainList.sort(function(a, b) {
//         //   console.log(a.item, b.item);
//         //   if(a.item === b.item){
//         //     return 0;
//         //   } else {
//         //     return (a.item < b.item) ? -1 : 1;
//         //   }
//         // });
//         // console.log('typeList' + typeList);
//         resolve(null, 'mainList ' + mainList);
//       } else {
//         // console.log('typeList', "Failed");
//         reject("mainList Failed " + ids.length, null);
//       }
//     });
//   });
// }
// //res.redirect(req.get('referer'));
//
// function FillItem() {
//   return new Promise(function(resolve, reject) {
//     Item.find({}, function(err, ids) {
//       // console.log('ids', ids.length);
//
//       if (ids.length != 0) {
//         ids.forEach(function(i) {
//
//           if (i.item.length > 0) {
//             const mulval = {
//               _id: i._id,
//               item: i.item,
//               type: i.type,
//               checked: false
//             }
//             // console.log('mulval', mulval);
//             itemList.push(mulval);
//           }
//         });
//         itemList.sort(function(a, b) {
//           if (a.item < b.item) {
//             return -1;
//           }
//           if (a.item > b.item) {
//             return 1;
//           }
//           return 0;
//         });
//         // console.log('typeList' + typeList);
//         resolve(null, 'itemList ' + itemList);
//       } else {
//         // console.log('typeList', "Failed");
//         reject("itemList Failed " + ids.length, null);
//       }
//     });
//   });
// }

//**********************************************************************
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Site Started Started Successfully");
  LoadDB().then(function(err, msg) {
    if (err) {
      console.log("LoadDB err", err);
    } else {
      // console.log("msg", msg);
      DBLoadItem().catch(function(err) {
        if (err) {
          console.log(err);
        }
      });
      DBLoadMainList().catch(function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
  }).then(function(err, msg) {
    if (err) {
      console.log("err", err);
    } else {
      FillItem().catch(function(err) {
        if (err) {
          console.log(err);
        }
      });
      FillMain().catch(function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
  }).catch(function(err) {
    if (err) {
      console.log("err", err);
    }
  });
});

//**********************************************************************
// const passValue = {
//   button: true,
// buttonLink: "/menu",
// buttonTitle: "Back",
// badgelist: null,
// useChecked: true,
// }
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

    MainList.find({
      name: selection
    }, function(err, ids) {
      if (ids.length != 0) {
        // alert("List already exists with that Title");
        console.log("todo: test with a redirect");
        // todo: test with a redirect
      } else {
        newTitle = selection;
        displayList = itemList;
        res.redirect("/list");
      }
    });
  }
});

//**********************************************************************

app.get("/activelist", function(req, res) {
  console.log("mainList.length", mainList.length);
  // console.log("mainList.length", mainList.length);
  if (mainList.length > 0) {
    buttonOne.button = true;
    buttonOne.buttonTitle = "Back";
    buttonOne.buttonLink = "/menu"

    buttonTwo.button = true;
    buttonTwo.buttonTitle = "Refresh";
    buttonTwo.buttonLink = "/save/refresh";

    displayList.length = 0;
    mainList.forEach(function(i) {
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

app.all("/list", function(req, res) {
  // if (req.isAuthenticated()){***********
  //   res.render("/secrets");**********
  // } else {***********
  //   res.render("/login");*****************
  // }
  // var nt = "Bee-gock!";

  // if (newTitle.length > 0) {
  //   nt = newTitle;
  // }
  //
  // if (listtoAdd.length > 0) {
  //   badgeList = listtoAdd;
  // }

  // if (itemList.length > 0) {
  //   displayList = itemList;
  // }

  // console.log(displayList);

  res.render("list.ejs", {
    title: newTitle,
    buttonOne: buttonOne,
    buttonTwo: buttonTwo,
    badgelist: badgeList,
    useChecked: useChecked,
    list: displayList
  });
});

//**********************************************************************

app.get("/lists/:which", function(req, res) {
  const which = req.params.which;

  mainList.find(function(idx) {
    if (idx.name === which) {
      displayList = idx.listitem;

      newTitle = which;
      listtoAdd.length = 0;

      buttonOne.button = true;
      buttonOne.buttonTitle = "Back";
      buttonOne.buttonLink = "/menu"

      buttonTwo.button = true;
      buttonTwo.buttonTitle = "Edit";
      buttonTwo.buttonLink = "/list/edit"

      res.redirect("/list");
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
    // buttonOne.button = true;
    // buttonOne.buttonTitle = "Back";
    // buttonOne.buttonLink = "/quantity"
    //
    // alertTitle = "Alert";
    // alertMessage = "Quantity of " + qty + " was too low";
    //
    // res.redirect("/alert");
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
