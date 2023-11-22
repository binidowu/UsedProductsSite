const mongoose = require("mongoose");

// Question Schema
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  askedBy: { type: String, required: false },
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
From the Front End 

to create Ad: 
//Token
const ad = {
  userId: "655bf5f8b1a1f404b9bf0ff6",
  itemName: "Washing machine",
  category: "Sports",
  description: "A classic red vintage bicycle in excellent condition. Rarely used, no scratches or dents, recently serviced.",
  location: "Downtown, Cityville",
  condition: "Used - Like New",
  price: 300,
  pictures: ["http://example.com/images/bicycle1.jpg", "http://example.com/images/bicycle2.jpg"],
  isActive: true,
  createdAt: "2023-11-14T18:52:16.302Z",
  updatedAt: "2023-11-21T00:10:25.768Z",
  endAt: "2023-12-31T23:59:59.000Z",
  questions: [],
};

//Response




-To edit Ad:
//Token
const ad = {
  category: "Sports",
  description: "A classic red vintage bicycle in excellent condition. Rarely used, no scratches or dents, recently serviced.",
  price: 300,
  pictures: ["http://example.com/images/bicycle1.jpg", "http://example.com/images/bicycle2.jpg"],
  endAt: "2023-12-31T23:59:59.000Z",
};
//Response
{
    "success": true,
    "message": "Ad updated successfully",
    "data": {
        "_id": "655bf96a7f60d40dff7b147c",
        "userId": "655bf5f8b1a1f404b9bf0ff6",
        "itemName": "Washing machine",
        "category": "Others",
        "description": "A classic red vintage bicycle in excellent condition. Rarely used, no scratches or dents, recently serviced.",
        "location": "Downtown, Cityville",
        "condition": "Used - Like New",
        "price": 300,
        "pictures": [
            "http://example.com/images/bicycle1.jpg",
            "http://example.com/images/bicycle2.jpg"
        ],
        "isActive": true,
        "createdAt": "2023-11-14T18:52:16.302Z",
        "updatedAt": "2023-11-21T00:37:24.084Z",
        "endAt": "2023-12-31T23:59:59.000Z",
        "questions": [],
        "__v": 0
    }
}

-To view all ads:
url: /ads
{
    "success": true,
    "data": [
        {
            "_id": "6553c1e067b6d2e9d09c5225",
            "userId": "6553bf4d635367b72f185f9a",
            "itemName": "Vintage Bicycle",
            "category": "Sports",
            "description": "A classic red vintage bicycle in excellent condition. Rarely used, no scratches or dents, recently serviced.",
            "location": "Downtown, Cityville",
            "condition": "Used - Like New",
            "price": 150,
            "pictures": [
                "http://example.com/images/bicycle1.jpg",
                "http://example.com/images/bicycle2.jpg"
            ],
            "isActive": true,
            "endAt": "2023-12-31T23:59:59.000Z",
            "createdAt": "2023-11-14T18:52:16.302Z",
            "questions": [],
            "__v": 0,
            "updatedAt": "2023-11-21T00:46:24.516Z"
        },
        {
            "_id": "6553cb9867b6d2e9d09c5227",
            "userId": "6553bf4d635367b72f185f9a",
            "itemName": "Professional DSLR Camera",
            "category": "Electronics",
            "description": "High-resolution camera with 24.1 MP APS-C CMOS sensor and 100-6400 ISO range. Perfect for professional photography.",
            "location": "Uptown, Photocity",
            "condition": "Used - Excellent",
            "price": 950,
            "pictures": [
                "http://example.com/images/camera-front.jpg",
                "http://example.com/images/camera-back.jpg",
                "http://example.com/images/camera-side.jpg"
            ],
            "isActive": true,
            "endAt": "2024-06-30T23:59:59.000Z",
            "questions": [
                {
                    "questionText": "Can you provide more details on the condition of the item?",
                    "askedBy": "654f013738aba66d45b65efc",
                    "answerText": "The camera has been gently used for a year and has no scratches or technical issues. It also comes with a free camera bag.",
                    "_id": "6555142748c32e8b9b697669",
                    "createdAt": "2023-11-15T18:55:35.633Z"
                }
            ],
            "createdAt": "2023-11-14T19:33:44.221Z",
            "__v": 1,
            "updatedAt": "2023-11-14T22:35:57.608Z"
        },
        {
            "_id": "6553f67666be5fee34b0cac0",
            "userId": "6553bf4d635367b72f185f9a",
            "itemName": "Professional DSLR Camera",
            "category": "Electronics",
            "description": "High-resolution camera with 24.1 MP APS-C CMOS sensor and 100-6400 ISO range. Perfect for professional photography.",
            "location": "Uptown, Photocity",
            "condition": "Used - Excellent",
            "price": 780,
            "pictures": [
                "http://example.com/images/camera-front.jpg",
                "http://example.com/images/camera-back.jpg",
                "http://example.com/images/camera-side.jpg"
            ],
            "isActive": true,
            "endAt": "2024-06-30T23:59:59.000Z",
            "questions": [],
            "createdAt": "2023-11-14T22:36:38.383Z",
            "updatedAt": "2023-11-14T22:36:38.383Z",
            "__v": 0
        },
        {
            "_id": "6553f6a166be5fee34b0cac2",
            "userId": "6553bf4d635367b72f185f9a",
            "itemName": "Professional DSLR Camera",
            "category": "Electronics",
            "description": "High-resolution camera with 24.1 MP APS-C CMOS sensor and 100-6400 ISO range. Perfect for professional photography.",
            "location": "Uptown, Photocity",
            "condition": "Used - Excellent",
            "price": 780,
            "pictures": [
                "http://example.com/images/camera-front.jpg",
                "http://example.com/images/camera-back.jpg",
                "http://example.com/images/camera-side.jpg"
            ],
            "isActive": false,
            "endAt": "2024-06-30T23:59:59.000Z",
            "questions": [],
            "createdAt": "2023-11-14T22:37:21.658Z",
            "updatedAt": "2023-11-14T23:04:11.678Z",
            "__v": 0
        },
        {
            "_id": "655bf724937ed56c08e2761d",
            "userId": "655bf5f8b1a1f404b9bf0ff6",
            "itemName": "Vintage Bicycle",
            "category": "Sports",
            "description": "A classic red vintage bicycle in excellent condition. Rarely used, no scratches or dents, recently serviced.",
            "location": "Downtown, Cityville",
            "condition": "Used - Like New",
            "price": 300,
            "pictures": [
                "http://example.com/images/bicycle1.jpg",
                "http://example.com/images/bicycle2.jpg"
            ],
            "isActive": true,
            "createdAt": "2023-11-14T18:52:16.302Z",
            "updatedAt": "2023-11-21T00:10:25.768Z",
            "endAt": "2023-12-31T23:59:59.000Z",
            "questions": [],
            "__v": 0
        },
        {
            "_id": "655bf7f09c9a9bdefc7c7ed4",
            "userId": "655bf5f8b1a1f404b9bf0ff6",
            "itemName": "Bicycle",
            "category": "Sports",
            "description": "A classic red vintage bicycle in excellent condition. Rarely used, no scratches or dents, recently serviced.",
            "location": "Downtown, Cityville",
            "condition": "Used - Like New",
            "price": 300,
            "pictures": [
                "http://example.com/images/bicycle1.jpg",
                "http://example.com/images/bicycle2.jpg"
            ],
            "isActive": true,
            "createdAt": "2023-11-14T18:52:16.302Z",
            "updatedAt": "2023-11-21T00:10:25.768Z",
            "endAt": "2023-12-31T23:59:59.000Z",
            "questions": [],
            "__v": 0
        },
        {
            "_id": "655bf96a7f60d40dff7b147c",
            "userId": "655bf5f8b1a1f404b9bf0ff6",
            "itemName": "Washing machine",
            "category": "Others",
            "description": "A classic red vintage bicycle in excellent condition. Rarely used, no scratches or dents, recently serviced.",
            "location": "Downtown, Cityville",
            "condition": "Used - Like New",
            "price": 300,
            "pictures": [
                "http://example.com/images/bicycle1.jpg",
                "http://example.com/images/bicycle2.jpg"
            ],
            "isActive": true,
            "createdAt": "2023-11-14T18:52:16.302Z",
            "updatedAt": "2023-11-21T00:46:04.965Z",
            "endAt": "2023-12-31T23:59:59.000Z",
            "questions": [],
            "__v": 0
        }
    ]
}

-To toggle ad status:
//Token
url: /disable/:adID
//Response
{
    "success": true,
    "message": "Ad disabled successfully",
    "data": {
        "_id": "655bf7f09c9a9bdefc7c7ed4",
        "userId": "655bf5f8b1a1f404b9bf0ff6",
        "itemName": "Bicycle",
        "category": "Sports",
        "description": "A classic red vintage bicycle in excellent condition. Rarely used, no scratches or dents, recently serviced.",
        "location": "Downtown, Cityville",
        "condition": "Used - Like New",
        "price": 300,
        "pictures": [
            "http://example.com/images/bicycle1.jpg",
            "http://example.com/images/bicycle2.jpg"
        ],
        "isActive": false,
        "createdAt": "2023-11-14T18:52:16.302Z",
        "updatedAt": "2023-11-21T00:55:54.406Z",
        "endAt": "2023-12-31T23:59:59.000Z",
        "questions": [],
        "__v": 0
    }
}


-To ask a question:
const question = {
      "questionText": "Is it negotiable",
      "askedBy":"Yusuf"
}
response:{
   "questions": [
            {
              "askedBy: "Yusuf",
                "questionText": "Is it negotiable",
                "answerText": "",
                "_id": "655c0341c58837e34fc2fd74",
                "createdAt": "2023-11-21T01:09:21.826Z"
            }]
}

-To answer a question:
//Token
const answer = {
  "answerText": "Yes it is negotiable"
}
*/
