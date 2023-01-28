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


router.post('/addstream', asyncerror(async (req, res, next) => {
    //create question
    const question = await Question.create(req.body.questions)
    // console.log(question)
    const category=await Category.findById(req.body.category)
    const result = await cloudinary.v2.uploader.upload(req.body.thumbnail, {
        folder: "thumbnails"
    })
    const stream = await Stream.create({
        url: req.body.url, question_id: question._id, thumbnail: {
            public_id: result.public_id, url: result.url
        },category:category.name,category_id:category._id
    })

    res.status(200).send({ success: true, stream })

}))

router.get('/allwithdrawspending', asyncerror(async (req, res, next) => {
    
    const withdraws = await History.find({status:"complete",type:"withdraw"})
   

    res.status(200).send({ success: true, withdraws })

}))
router.get('/allwithdraws', asyncerror(async (req, res, next) => {
    
    const withdraws = await History.find({type:"withdraw"})
   

    res.status(200).send({ success: true, withdraws })

}))
router.post('/completewithdraw', asyncerror(async (req, res, next) => {
    
    const withdraw = await History.findByIdAndUpdate(req.body.id,{
        status:"complete"
    })
   

    res.status(200).send({ success: true, withdraw })

}))
router.post('/rejectwithdraw', asyncerror(async (req, res, next) => {
    const withdraw = await History.findByIdAndUpdate(req.body.id,{
        status:"reject"
    })
   

    res.status(200).send({ success: true, withdraw })

}))
router.post('/addcategory', asyncerror(async (req, res, next) => {
    const result = await cloudinary.v2.uploader.upload(req.body.image, {
        folder: "category"
    })
    console.log(result)
    const stream = await Category.create({
       name:req.body.name,image:{url:result.url,public_id:result.public_id}
    })
    console.log(stream)

    res.status(200).send({ success: true, stream })

}))
router.post('/delcategory', asyncerror(async (req, res, next) => {
    const category=await Category.findById(req.body.id)
    await cloudinary.v2.uploader.destroy(category.image.public_id)
    await Category.findByIdAndDelete(req.body.id)
    res.status(200).send({ success: true })

}))
router.get('/allcategory', asyncerror(async (req, res, next) => {
    const category=await Category.find()
    res.status(200).send({ success: true ,category})

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
    const winners = req.body.winners;
    const reward = req.body.reward;
    const updatebalance =asyncerror( async (userid, balance) => {
        const user = await User.findById(userid);
        // console.log(user)
        if(user!==null){
        let newbalance=user?.balance+balance;
        await User.findByIdAndUpdate(userid,{
            balance:newbalance
        })
    }
    })
    for (const elem of winners) {
        let totalprice = elem.amount;
        let percent = (elem.amount * reward) / 100;
        totalprice += percent
        updatebalance(elem.user_id, totalprice)
    }

    res.status(200).send({ success: true })

}))



module.exports = router