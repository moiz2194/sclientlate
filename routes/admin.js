const express = require('express');
const router = express.Router();
const asyncerror = require('../middlewares/catchasyncerror.js');
const ErrorHandler = require('../middlewares/errorhandler');
const jwt = require('jsonwebtoken');
const User = require('../model/user.js')
const Stream = require('../model/stream.js')
const Question = require('../model/question.js')
const Category = require('../model/category.js')
const Bids = require('../model/bids.js')
const { verifyToken, isadmin } = require('../middlewares/verifyauth.js');
const cloudinary = require('cloudinary')
const History = require('../model/History.js')
const Streamer = require('../model/streamers.js')
const Banner = require('../model/banners.js');
const sendnotification = require('../middlewares/Sendnotification.js');


// Send notification
router.post('/sendnotification',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const result=await cloudinary.v2.uploader.upload(req.body.image,{
        folder:"notification"
    })
   sendnotification('',req.body.message,'all',result.public_id,result.url)
    res.status(200).send({ success: true })

}))
// Update question
router.post('/addquestion',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const question=await Question.create(req.body.questions);
    const stream=await Stream.findById(req.body.stream_id)
    let newquestions=stream.question_id
    newquestions.push(question._id)

    await Stream.findByIdAndUpdate(req.body.stream_id,{
        question_id:newquestions
    })

    res.status(200).send({ success: true })

}))
// Add Banners
router.post('/addbanner',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const result=await cloudinary.v2.uploader.upload(req.body.image,{
        folder:"Banner"
    })
    const banner = await Banner.create({
        link:req.body.link,
        url:result.url,
        public_id:result.public_id,
        page:req.body.page
    })
    res.status(200).send({ success: true, banner })

}))
router.post('/delbanner',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const result=await cloudinary.v2.uploader.destroy(req.body.public_id,{
        folder:"Banner"
    })
    const banner = await Banner.findByIdAndDelete(req.body.id)
    res.status(200).send({ success: true, banner })

}))
router.get('/allbanner',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    
    const banner = await Banner.find()
    res.status(200).send({ success: true, banner })

}))

//Add streamer
router.post('/addstreamer',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const result=await cloudinary.v2.uploader.upload(req.body.image,{
        folder:"Streamers"
    })
    const streamer = await Streamer.create({
        name:req.body.name,
        url:result.url,
        public_id:result.public_id,
    })
    res.status(200).send({ success: true, streamer })

}))
router.post('/delstreamer',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const result=await cloudinary.v2.uploader.destroy(req.body.public_id)
    const streamer = await Streamer.findByIdAndDelete(req.body.id)
    res.status(200).send({ success: true, streamer })

}))

///
router.post('/addstream', asyncerror(async (req, res, next) => {
    //create question
    const question = await Question.create(req.body.questions)
    // console.log(question)
    const category = await Category.findById(req.body.category)
    const result = await cloudinary.v2.uploader.upload(req.body.thumbnail, {
        folder: "thumbnails"
    })
    const stream = await Stream.create({
        title: req.body.title,
        url: req.body.url,
        question_id: [question._id],
        thumbnail:  {
            public_id: result.public_id,
            url: result.url
        },
        category: category.name,
        category_id: category._id,
        streamer_id: req.body.streamer_id,
        streamer_name: req.body.streamer_name
    })

    res.status(200).send({ success: true, stream })

}))

router.get('/allwithdrawspending', asyncerror(async (req, res, next) => {

    const withdraws = await History.find({ status: "pending", type: "withdraw" })


    res.status(200).send({ success: true, withdraws })

}))
router.get('/allhistory', asyncerror(async (req, res, next) => {

    const withdraws = await History.find()


    res.status(200).send({ success: true, withdraws })

}))
router.post('/completewithdraw', asyncerror(async (req, res, next) => {

    const withdraw = await History.findByIdAndUpdate(req.body.id, {
        status: "complete"
    })


    res.status(200).send({ success: true, withdraw })

}))
router.post('/rejectwithdraw', asyncerror(async (req, res, next) => {
    const withdraw = await History.findByIdAndUpdate(req.body.id, {
        status: "reject"
    })


    res.status(200).send({ success: true, withdraw })

}))
router.post('/addurl', asyncerror(async (req, res, next) => {
    const stream = await Stream.findByIdAndUpdate(req.body.id, {
        url: req.body.url
    })


    res.status(200).send({ success: true, stream })

}))
router.post('/addcategory', asyncerror(async (req, res, next) => {
    const result = await cloudinary.v2.uploader.upload(req.body.image, {
        folder: "category"
    })
    console.log(result)
    const stream = await Category.create({
        name: req.body.name, image: { url: result.url, public_id: result.public_id }
    })
    console.log(stream)

    res.status(200).send({ success: true, stream })

}))
router.post('/delcategory', asyncerror(async (req, res, next) => {
    const category = await Category.findById(req.body.id)
    await cloudinary.v2.uploader.destroy(category.image.public_id)
    await Category.findByIdAndDelete(req.body.id)
    res.status(200).send({ success: true })

}))
router.get('/allcategory', asyncerror(async (req, res, next) => {
    const category = await Category.find()
    res.status(200).send({ success: true, category })

}))

router.post('/endstream', asyncerror(async (req, res, next) => {
    //create question
    const stream = await Stream.findById(req.body.id)
    const question = await Question.findById(stream.question_id);
    const correct_answer = req.body.correct_answer;
    let val;
    question.answer.forEach((e) => {
        if (e._id.toString() === correct_answer) {
            val = e
        }
    })
    console.log(val)
    const winningbids = await Bids.find({ answer_id: val._id })
    console.log(winningbids)
    let totalwinners = 0;
    winningbids.forEach((elem) => {
        totalwinners += 1
    })
    res.status(200).send({ success: true, winningbids, totalwinners })

}))

router.post('/paywinners', asyncerror(async (req, res, next) => {
    //create question
    const stream_id = req.body.stream_id
    const winners = req.body.winners;
    const reward = req.body.reward;
    const updatebalance = asyncerror(async (userid, balance) => {
        const user = await User.findById(userid);
        // console.log(user)
        if (user !== null) {
            let newbalance = user?.balance + balance;
            await User.findByIdAndUpdate(userid, {
                balance: newbalance
            })
            await Bids.findOneAndUpdate({user_id:userid},{
                status:"Won",
                amount_won:balance
            })
        }
    })
    for (const elem of winners) {
        let totalprice = elem.amount;
        let percent = (elem.amount * reward) / 100;
        totalprice += percent
        updatebalance(elem.user_id, totalprice)
    }
   const totalbids= await Bids.find({stream_id});
   const stream=  await Stream.findByIdAndDelete(stream_id)

   for (const elem of totalbids) {
    await Bids.findOneAndUpdate({status:"pending",stream_id},{
        status:"Lose"
    })
    sendnotification('Stream has ended Open Pride App to see result',elem.user_id,stream.thumbnail.public_id,stream.thumbnail.url)
    
   }
    res.status(200).send({ success: true })

}))

router.post('/changeapikey', verifyToken, isadmin, asyncerror(async (req, res, next) => {
    await User.findByIdAndUpdate(req._id, {
        api_key: req.body.api_key,
        api_id: req.body.api_id,
    })
    res.status(200).send({ success: true })
}))

router.post('/login', asyncerror(async (req, res, next) => {
    console.log(req.body)
    const user = await User.findOne({ mobile: req.body.mobile })
    if (!user) {
        return next(new ErrorHandler('No user found', 404))
    }
    if (user.role !== 'admin') {
        return next(new ErrorHandler('Not allowed', 405))
    }
    if (user.password !== req.body.password) {
        console.log(user.password)
        return next(new ErrorHandler('Wrong credentials', 405))
    }
    const token = jwt.sign({ id: user._id }, 'moiz2194')
    res.status(200).send({ success: true, token })
}))




module.exports = router