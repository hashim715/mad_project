const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const AWS = require('aws-sdk');



const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");
require('dotenv').config();



mongoose
  .connect("", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongo Db");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDb", err);
  });


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const multer = require("multer");

// // Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// app.listen(port, () => {
//   console.log("Server running on port 8000");
// });

// make the app listen at port 8005
app.listen(8005, () => {
  console.log("Server running on port 8005");
});

const User = require("./models/user");
const Groups = require("./models/groups");
const Events = require("./models/events");

//endpoint for registration of the user

app.post("/register", (req, res) => {
  const { name, username, email, password, year} = req.body;

  // create a new User object
  const newUser = new User({ name,username, email, password, year });

  // save the user to the database
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      //console.log("Error registering user", err);
      res.status(500).json({ message: err});
    });
});

//function to create a token for the user
const createToken = (userId) => {
  // Set the token payload
  const payload = {
    userId: userId,
  };

  // Generate the token with a secret key and expiration time
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk");

  return token;
};

//endpoint for logging in of that particular user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  //check if the email and password are provided
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Email and the password are required" });
}

  //check for that user in the database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        //user not found
        return res.status(404).json({ message: "User not found" });
      }

      //compare the provided passwords with the password in the database
      if (user.password !== password) {
        return res.status(404).json({ message: "Invalid Password!" });
      }

      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.log("error in finding the user", error);
      res.status(500).json({ message: "Internal server Error!" });
    });
});



// returns the data for the user given his user ID
app.get("/username/:userId", (req, res) => {
  
  const { userId } = req.params;
  
  User.findById(userId)
    .then(user => {
      if (user) {
        res.status(200).json({ 
          username: user.username, 
          name: user.name, 
          course_1: user.course_1, 
          course_2: user.course_2, 
          course_3: user.course_3, 
          course_4: user.course_4, 
          course_5: user.course_5, 
          image: user.image,
          num_groups: user.num_groups  
        });
      } else {
        res.status(404).json({ message: "User not found", "message_2":email });
      }
    })
    .catch(err => {
      //console.log("Error retrieving user", err);
      res.status(500).json({ message: "Error retrieving user", "message_3": err });
    });
});

app.post('/upload', upload.single('image'), async (req, res) => {
  const params = {
    Bucket: "w-groupchat-images",
    Key: `${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    //ACL: 'public-read',
  };

  try {
    const s3Response = await s3.upload(params).promise();
    //res.status(200).send({ url: req.username});
    username = req.body.username;
    const user = await User.findOne({"username": username});
    user.image = s3Response.Location;
    await user.save();
    res.status(200).send({ url: "great job" });
  } catch (error) {
    res.status(500).send(req.body);
  }
});

app.post('/changeprofile', async (req, res) => {
    try {
    const userId = req.body.userId;
    const course1 = req.body.course1;
    const course2 = req.body.course2;
    const course3 = req.body.course3;
    const course4 = req.body.course4;
    const course5 = req.body.course5;
    const name = req.body.name;
    const user = await User.findById(userId);
    user.name = name;
    user.course_1 = course1;
    user.course_2 = course2;
    user.course_3 = course3;
    user.course_4 = course4;
    user.course_5 = course5;
    await user.save();
    res.status(200).send("great job");
  } catch (error) {
    res.status(500).send("Error updating profile");
  }
});


// Define the POST route to create a new group
app.post('/groups', async (req, res) => {
  try {
    const { id, name, image } = req.body;

    // Create a new group instance
    const newGroup = new Groups({
      id,
      name,
      image: image || undefined, // If no image is provided, it will use the default value
    });

    // Save the group to the database
    await newGroup.save();

    res.status(201).json({
      message: 'Group created successfully',
      group: newGroup,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating group',
      error: error.message,
    });
  }
});

// Define the GET route to fetch all groups
app.get('/groups', async (req, res) => {
  try {
    // Find all groups in the database
    const groups = await Groups.find();

    res.status(200).json({
      message: 'Groups fetched successfully',
      groups,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error fetching groups',
      error: error.message,
    });
  }
});



// create a group
app.post("/create-group", upload.single('image'), async (req, res) => {
  const { name, image, userId, description } = req.body;

  const id = Math.random().toString(36);

  const params = {
    Bucket: "w-groupchat-images",
    Key: `${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    //ACL: 'public-read',
  };

  try {
    const s3Response = await s3.upload(params).promise();
    const imageUrl = s3Response.Location;
   
    const newGroup = new Groups({
      name,
      image: imageUrl,
      id,
      adminId: userId,
      description: description,
      members: [userId]
    });

    newGroup
    .save()
    .then(() => {
      res.status(200).json({ message: "Group created successfully" });
    })
    
    
  } catch (error) {
    res.status(500).send(req.body);
  }

});

// get the details of a group given its id
app.get("/group/:id", (req, res) => {
  const { id } = req.params;

  Groups.findOne({ id:id })
    .then(group => {
      if (group) {
        res.status(200).json({ group });
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving group", error: err });
    });
});


app.post("/adduser", (req, res) => {
  const { userId, image } = req.body;
  
  Groups.findOne({ image: image })
    .then(group => {
      if (group) {
        if (group.members.includes(userId)) {
          res.status(400).json({ message: "User is already part of the group" });
        } else {
          group.members.push(userId);
          group.save()
            .then(() => {
              res.status(200).json({ message: "User added to group" });
            })
            .catch(err => {
              res.status(500).json({ message: "Error saving group", error: err });
            });
        }
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error adding user to group", error: err });
    });
});

  


// returns the groups that the user is a member of
app.get("/getgroups/:userId", (req, res) => {
  const { userId } = req.params;

  Groups.find({ members: userId })
    .then(groups => {
      if (groups.length === 0) {
        res.status(200).json({ message: "No groups found" });
        return;
      }
      else{
        res.status(200).json({ groups });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving groups", error: err });
    });
});


// retruns the total number of groups that the user is a member of by searching its id in the members array of the groups
app.get("/numgroups/:userId", (req, res) => {
  const { userId } = req.params;

  Groups.find({ members: userId })
    .then(groups => {
        res.status(200).json({ num_groups: groups.length })
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving groups", error: err });
    });
});


// Give a group id, returns the members of that group.
app.get("/groupmembers/:groupId", (req, res) => {
  const { groupId } = req.params;

  Groups.findOne({ id: groupId })
    .then(group => {
      if (group) {
        res.status(200).json({ members: group.members});
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving group members", error: err });
    });
});


// given a list of member ids, returns all the members as an array of objects

app.post("/allmembers", (req, res) => {
  const { memberIds } = req.body;

  // Check if memberIds is defined and is an array
  if (!Array.isArray(memberIds)) {
    return res.status(400).json({ message: "Invalid input, memberIds must be an array." });
  }

  const memberObjectIds = memberIds.map(id => new mongoose.Types.ObjectId(id));

  User.find({ _id: { $in: memberObjectIds } })
    .then(members => {
      res.status(200).json({ members, num_members: members.length });
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving members", error: err });
    });
});


// give a user id and group id, make the user leave that group by removing his id from the members array of the group
app.post("/leavegroup", (req, res) => {
  const { userId, groupId } = req.body
  Groups.findOne({ id: groupId })
    .then(group => {
      if (group) {
        if (group.members.includes(userId)) {
          group.members = group.members.filter(member => member !== userId);
          group.save()
            .then(() => {
              res.status(200).json({ message: "User left group" });
            })
            .catch(err => {
              res.status(500).json({ message: "Error saving group", error: err });
            });
        } else {
          res.status(400).json({ message: "User is not part of the group" });
        }
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error leaving group", error: err });
    });
  });


// create a event
app.post("/create-event", upload.single('image'), async (req, res) => {
  const { name, userId, location, description, time } = req.body;

  const id = Math.random().toString(36);

  const params = {
    Bucket: "w-groupchat-images",
    Key: `${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    //ACL: 'public-read',
  };

  try {
    const s3Response = await s3.upload(params).promise();
    const imageUrl = s3Response.Location;
   
    const newGroup = new Events({
      name: name,
      image: imageUrl,
      id,
      adminId: userId,
      description: description,
      time: time,
      location: location,
    });

    newGroup
    .save()
    .then(() => {
      res.status(200).json({ message: "Event created successfully" });
    })
    
  } catch (error) {
    res.status(500).send(req.body);
  }

});

// get all the groups
app.get("/events", (req, res) => {
  Events.find()
    .then(events => {
      if (events.length === 0) {
        res.status(200).json({ message: "No events found" });
        return;
      }
      else{
        res.status(200).json({ events });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving events", error: err });
    });
});




// get the details of a event given its id
// app.get("/event/:id", (req, res) => {
//   const { id } = req.params;

//   Events.findOne({ id:id })
//     .then(event => {
//       if (event) {
//         res.status(200).json({ event });
//       } else {
//         res.status(404).json({ message: "Event not found" });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({ message: "Error retrieving event", error: err });
//     });
// });


// given a event id, returns its details
app.get("/event/:id", (req, res) => {
  const { id } = req.params;

  Events.findOne({ id: id })
    .then(event => {
      if (event) {
        res.status(200).json({ event });
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving event", error: err });
    });
}
);


