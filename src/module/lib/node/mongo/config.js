let config={
  schema:{
    title:  String,
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs:  Number
    }
  },
  url:'mongodb://127.0.0.1:27017/test'
}

module.exports=config;
