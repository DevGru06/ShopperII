//jshint esversion:6
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  item: String,
  type: String
});

const listitem = new mongoose.Schema({
  itemID: String,
  item: String,
  quantity: Number,
  type: String
});
const mainlistSchema = new mongoose.Schema({
  name: String,
  createdDate: Date,
  checkedDate: Date,
  closed: Boolean,
  listitem: [listitem]
});



const Item = mongoose.model("items", itemSchema);
const MainList = new mongoose.model("MainList", mainlistSchema);

const mainList = new Array();
const itemList = new Array();

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

module.exports = {

    Items: Item,
    Lists: MainList,
    mainL: mainList,
    itemL: itemList,

    // Save: function(title, badgelist) {
    //   return new Promise(function(resolve, reject) {
    //
    //     // if (badgelist.length > 0) {
    //       const newb = new MainList({
    //         name: title,
    //         createdDate: Date.now(),
    //         checkedDate: new Date(1111, 11, 11),
    //         closed: false,
    //         listitem: badgelist,
    //       });
    //       newb.markModified('listitem');
    //       newb.save();
    //
    //       resolve(newb);
    //     // } else {
    //       // reject("badgelist Zero");
    //     // }
    //   });
    // },

    // id: if no idea then its a new list
    // closed: means you are closeing the shopping list
    Save: function(id, title, badgelist, closed) {
      return new Promise(function(resolve, reject) {

            if (id.length > 0) {
              MainList.find({
                _id: id
              }, function(err, arr) {
                if (err) {
                  console.log(err);
                } else {
                  const newb = new MainList({
                    name: title,
                    createdDate: Date.now(),
                    checkedDate: new Date(1111, 11, 11),
                    closed: closed,
                    listitem: badgelist,
                  });
                  newb.markModified('listitem');
                  newb.save();
                  resolve(newb);
                } // else
              }); // function);
            } //mainlist
          });// promise
        }, // end function

        Update: function(title, badgelist, closed) {},

        // todo something to add/remove and update

        RefreshServer: function() {
          FillItem().catch(function(err) {
            if (err) {
              console.log(err);
            }
          });
          // console.log("FillMain");
          FillMain().catch(function(err) {
            if (err) {
              console.log(err);
            }
          });
        },

        BeginServer: function() {
          return new Promise(function(resolve, reject) {
            LoadDB().then(function(err, msg) {
              // console.log("LoadDB");
              if (err) {
                console.log("LoadDB err", err);
              } else {
                // console.log("msg", msg);
                // console.log("DBLoadItem");
                DBLoadItem().catch(function(err) {

                  if (err) {
                    console.log(err);
                  }
                });
                // console.log("DBLoadMainList");
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
                // console.log("FillItem");
                FillItem().catch(function(err) {
                  if (err) {
                    console.log(err);
                  }
                });
                // console.log("FillMain");
                FillMain().catch(function(err) {
                  if (err) {
                    console.log(err);
                  }
                });
              }
              // }).then(function() {
              //   setTimeout(function() {
              //     // console.log("resolve");
              //     // console.log("itemList", itemList);
              //     // console.log("mainList", mainList);
              //     return resolve(null, itemList, mainList);
              //   }, 3000);
            }).catch(function(err) {
              if (err) {
                console.log("err", err);
              }
            });
          });
        }
    }

    const LoadDB = function() { //REFACTOR ME TO MAKE PROMISE WORK RIGHT mongodb+srv://Admin:Royalty99@orderist-33pfq.mongodb.net/orderdb?retryWrites=true
      return new Promise(function(resolve, reject) {
        if (mongoose.connection.readyState === 0) {
          mongoose.connect('mongodb+srv://Admin:' + process.env.PASSWORD + '@cluster0-k5alh.azure.mongodb.net/shopmedb?retryWrites=true', options).catch((err) => {
            console.log(err.stack); //"Error Connecting to the Mongodb Database"
          });
          mongoose.set("useCreateIndex", true);

          if (mongoose.connection.readyState === 0) {
            reject("UN-Succesfully Connected to the Mongodb Database", null);
          } else {
            resolve(null, "Succesfully Connected to the Mongodb Database");
          }
        } else {
          console.log("Already connected");
        }
      });
    };

    //**********************************************************************
    const DBLoadItem = function() {
      return new Promise(function(resolve, reject) {
        // Item = mongoose.model("items", itemSchema);
        if (Item.length > 0) {
          resolve(null, "[Item " + Item.length + "]");
        } else {
          reject("Item Failed", null);
        }
      });
    }

    const DBLoadMainList = function() {
      return new Promise(function(resolve, reject) {
        // MainList = new mongoose.model("MainList", mainlistSchema);
        if (MainList.length > 0) {
          resolve(null, "[MainList " + MainList.length + "]");
        } else {
          reject("MainList Failed", null);
        }
      });
    }

    function FillMain() {
      return new Promise(function(resolve, reject) {

        MainList.find({}, function(err, ids) {
          // console.log('ids', ids.length);
          mainList.length = 0;
          if (ids.length != 0) {
            ids.forEach(function(i) {
              const mulval = {
                _id: i._id,
                name: i.name,
                createdDate: i.createdDate,
                checkedDate: i.checkedDate,
                closed: i.closed,
                listitem: i.listitem
              }
              mainList.push(mulval);
            });
            // console.log("mainList", mainList);

            resolve(null, mainList);
          } else {
            reject("mainList Failed " + ids.length, null);
          }
        });
      });
    }


    function FillItem() {
      return new Promise(function(resolve, reject) {
        Item.find({}, function(err, ids) {
          if (ids.length != 0) {
            itemList.length = 0;
            ids.forEach(function(i) {

              if (i.item.length > 0) {
                const mulval = {
                  _id: i._id,
                  item: i.item,
                  type: i.type,
                  checked: false
                }
                itemList.push(mulval);
              }
            });
            // console.log("itemList", itemList);
            itemList.sort(function(a, b) {
              if (a.item < b.item) {
                return -1;
              }
              if (a.item > b.item) {
                return 1;
              }
              return 0;
            });
            // console.log('typeList' + typeList);
            resolve(null, itemList);
          } else {
            // console.log('typeList', "Failed");
            reject("itemList Failed " + ids.length, null);
          }
        });
      });
    }
