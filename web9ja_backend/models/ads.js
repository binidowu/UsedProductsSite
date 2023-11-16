const mongoose = require("mongoose");

// Question Schema
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  answerText: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const adSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  condition: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  pictures: {
    type: [String],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  endAt: {
    type: Date,
  },
  questions: [questionSchema],
});

module.exports = mongoose.model("Ad", adSchema);

/*

-create ad ({
    /check if user is logged in

    //sending to front end{
        //message
        //data
    }
})
-view all ads (get){
    //all data
}
-update ad({
    //check if user is logged in
    //check if user is the owner of the adweb9ja_backend/models/ads.js
    FE{
        user id,
        ad id,
        updated fields
    }
    Sending to front end
    {
        updated ad
        //data
    }
})
-delete ad({
    //check if user is logged in
    //check if user is the owner of the ad
   FE {
        //user id
        //ad id
        //message
    }
     Sending to front end
    {
        updated ad
        //data
    }

})

-to ask a question{
        //no authorization
        //get ad id ..{
            //check if ad is active
            //extract Ad
            //get question field of Ad 
            //create a new question object
            //set the questionText field to the question asked from client
        }

        FE{
            //ad id
            //question text
            //asked by?(if signed in)
        }

 }

 -to answer a question{
    //authorization signed in
    //(middle ware gets ad) get ad id ..{
        //check if ad is active
        //extract Ad
    }
    //authorization owner of ad
    //middle gives us ad
    //extract questions field of ad
    //use question id to get question

    FE{
        user id,
        ad id,
        question id,
        answer text
    }
 }
*/
