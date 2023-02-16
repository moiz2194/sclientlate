const express = require('express');
const router = express.Router();
const asyncerror = require('../middlewares/catchasyncerror.js');
const ErrorHandler = require('../middlewares/errorhandler');
const jwt = require('jsonwebtoken');
const User = require('../model/user.js')
const Question = require('../model/question.js')
const Depositreq = require('../model/depositreq.js')
const Bid = require('../model/bids.js')
const History = require('../model/History.js')
const Stream = require('../model/stream.js')
const Streamer = require('../model/streamers.js')
const Favourite = require('../model/favourites.js')
const { verifyToken, isadmin } = require('../middlewares/verifyauth.js');
const cloudinary = require('cloudinary');
const sendmsg = require('../middlewares/sendmsg.js');
const otpGenerator = require("otp-generator")
const crypto = require('crypto');
const {v4:uuid} = require('uuid');
const Razorpay = require('razorpay')
const Banner = require('../model/banners.js');
const Notification=require('../model/notifications.js')

//Updates
router.get('/getallnotification',verifyToken, asyncerror(async (req, res, next) => {
    const notification = await Notification.find({ $or: [{to: "all"}, {to: req._id}] });

     res.status(200).send({ success: true, notification })
 }))
// 1 Favourites

router.post('/addfavourite',verifyToken, asyncerror(async (req, res, next) => {
   const favourite=await Favourite.create({
    user_id:req._id,stream_id:req.body.stream_id
   })
    res.status(200).send({ success: true, favourite })
}))
router.get('/getbannermain',verifyToken, asyncerror(async (req, res, next) => {
   const banner=await Banner.find({page:"main"})
    res.status(200).send({ success: true, banner })
}))
router.get('/getbannersecond',verifyToken, asyncerror(async (req, res, next) => {
   const banner=await Banner.find({page:"second"})
    res.status(200).send({ success: true, banner })
}))
router.get('/getbannerthird',verifyToken, asyncerror(async (req, res, next) => {
   const banner=await Banner.find({page:"third"})
    res.status(200).send({ success: true, banner })
}))
router.get('/favourites',verifyToken, asyncerror(async (req, res, next) => {
   const favourites=await Favourite.find({user_id:req._id})
    res.status(200).send({ success: true, favourites })
}))
router.post('/delfavourite',verifyToken, asyncerror(async (req, res, next) => {
   const favourite=await Favourite.findByIdAndDelete(req.body.id)
    res.status(200).send({ success: true, favourite })
}))
// 2 My streams
router.get('/mystreams',verifyToken, asyncerror(async (req, res, next) => {
   const mybids=await Bid.find({user_id:req._id})
   let mystreams=[];
 for (const elem of mybids) {
    const onestream=await Stream.findById(elem.stream_id)
    mystreams.push(onestream)
 }
   
    res.status(200).send({ success: true, mystreams })
}))

// 3 gift streamer
router.post('/giftstreamer',verifyToken, asyncerror(async (req, res, next) => {
    const user=await User.findById(req._id);
    const streamer=await Streamer.findById(req.body.streamer_id)
    const rank=streamer.rank+10
    const newgifts=streamer.gifts
    newgifts.push({
        amount:req.body.amount,
        user_name:user.name
    })
    await Streamer.findByIdAndUpdate(streamer._id,{
        gifts:newgifts,
        rank:rank
    })
    let newbalance=user.balance-req.body.amount;
    await User.findByIdAndUpdate(user._id,{
        balance:newbalance
    })
    res.status(200).send({ success: true, token })
}))
router.post('/streamerbyid',verifyToken, asyncerror(async (req, res, next) => {
    const streamer_id=req.body.streamer_id;
    const streamer=await Streamer.findById(streamer_id)
    res.status(200).send({ success: true, streamer })
}))
// 4 ALl streamers 
router.get('/allstreamer', asyncerror(async (req, res, next) => {
    const streamers = await Streamer.find().sort({rank:-1})
    res.status(200).send({ success: true, streamers })

}))
router.get('/allusers', asyncerror(async (req, res, next) => {
    const streamers = await User.find().sort({rank:-1}).limit(100)
    res.status(200).send({ success: true, streamers })

}))

///payment  gateway
router.post('/order', asyncerror(async (req, res, next) => {
    const admin=await User.findOne({role:"admin"})
    const apikey=admin.api_key;
    const apiid=admin.api_id;
    const instance = new Razorpay({
      key_id: apiid,
      key_secret: apikey
    })
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString('hex')
    }
    instance.orders.create(options, (error, order) => {
      if (error) {
        return next(new ErrorHandler(error, 405))
      }
      res.status(201).json({ data: order })
    })
  }))
  router.post('/verify', asyncerror(async (req, res, next) => {
    const admin=await User.findOne({role:"admin"})
    const apikey=admin.api_key;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedsign = crypto.createHmac("sha256", apikey).update(sign.toString()).digest("hex")
    if (razorpay_signature === expectedsign) {
      return res.status(200).send({ success: true, msg: "Payment Verified successfully" })
    } else {
      return res.status(405).send("Enter valid signature")
    }
  }))  

router.post('/register', asyncerror(async (req, res, next) => {
    const otptoken = req.header('otp-token')
    let otp;
    if (!otptoken) {
        return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(otptoken, 'moiz2194', (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: err });
        }
        otp = decoded.otp;
    });
    console.log(otp, req.body.otp)
    if (req.body.otp !== otp) {
        return next(new ErrorHandler("Wrong otp", 405))
    }
    const result=await cloudinary.v2.uploader.upload(req.body.profile);
    req.body.url=result.url
    let user = await User.create(req.body)

    const token = jwt.sign({ id: user._id }, 'moiz2194')
    res.status(200).send({ success: true, token })

}))
router.post('/login', asyncerror(async (req, res, next) => {
    const otptoken = req.header('otp-token')
    let otp;
    if (!otptoken) {
        return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(otptoken, 'moiz2194', (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: err });
        }
        otp = decoded.otp;
    });
    console.log(otp, req.body.otp)
    if (req.body.otp !== otp) {
        return next(new ErrorHandler("Wrong otp", 405))
    }
    let user = await User.findOne({ mobile: req.body.mobile })
    if (!user) {
        return next(new ErrorHandler('No user found', 404))
    }
    const token = jwt.sign({ id: user._id }, 'moiz2194')

    res.status(200).send({ success: true, token })

}))
router.post('/otp', asyncerror(async (req, res, next) => {
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    sendmsg(req.body.mobile, otp)
    const token = await jwt.sign({ otp }, 'moiz2194')
    res.status(200).send({ success: true, token })
}))
router.get('/streams', asyncerror(async (req, res, next) => {
    let streams = await Stream.find().sort({trend:-1})

    res.status(200).send({ success: true, streams })

}))
router.get('/nowstreams', asyncerror(async (req, res, next) => {
    let streams = await Stream.find({
        $or: [{ url: { $exists: true } }, { url: { $ne: null } }]
      }).sort({createdAt:-1})

    res.status(200).send({ success: true, streams })

}))
router.post('/questionbyid', asyncerror(async (req, res, next) => {
    const id = req.body.id
    let stream = await Stream.findById(id);
    const questions=[]
    for (const elem of stream.question_id) {
        const thisquestion=await Question.findById(elem)
        questions.push(thisquestion)
    }

    res.status(200).send({ success: true, questions })

}))
router.post('/streambycategory', asyncerror(async (req, res, next) => {
    const category = req.body.category
    let streams = await Stream.find({ category_id: category }).sort({trend:-1})

    res.status(200).send({ success: true, streams })

}))
router.post('/stream', asyncerror(async (req, res, next) => {
    let stream = await Stream.findById(req.body.id)
    const questions = await Question.findById(stream.question_id)
    res.status(200).send({ success: true, stream, questions })

}))

router.post('/bid', verifyToken, asyncerror(async (req, res, next) => {
    const myaccount=await User.findById(req._id);
    if(myaccount.balance<req.body.amount){
        return next(new ErrorHandler('Not enough balance',405))
    }
    let stream = await Stream.findById(req.body.stream_id)
    const user = await User.findById(req._id)
    const questions = await Question.findById(req.body.question_id)
    const bid = await Bid.create({
        name: user.name, mobile: user.mobile,
        question_id: questions._id, user_id: req._id, amount: req.body.amount, answer_id: req.body.answer_id,
        answer: req.body.answer,stream_id:req.body.stream_id
    })
    //Increase  trend of stream
    const newtrend=stream.trend+1
   await Stream.findByIdAndUpdate(stream._id,{
    trend:newtrend
   })
    //
    const newrank=user.rank+5
    const newbalance=user.balance-bid.amount
    await User.findByIdAndUpdate(user._id,{
        balance:newbalance,
        rank:newrank
    })
    await Streamer.findByIdAndUpdate(stream.streamer_id,{
        rank:newrank
    })
    res.status(200).send({ success: true, bid })

}))
router.get('/mybids', verifyToken, asyncerror(async (req, res, next) => {
    const bids = await Bid.find({ user_id: req._id }).populate("stream_id","title")

    res.status(200).send({ success: true, bids })

}))

router.post('/getuserbyid', verifyToken, asyncerror(async (req, res, next) => {
    let id = req.body.id;
    const user = await User.findById(id)

    res.status(200).send({ success: true, user })

}))
router.get('/me', verifyToken, asyncerror(async (req, res, next) => {
    const user = await User.findById(req._id)

    res.status(200).send({ success: true, user })

}))

router.post('/getallbids', asyncerror(async (req, res, next) => {
    const stream = await Stream.findById(req.body.id)
    const allbids = await Bid.find({ question_id: stream.question_id })

    res.status(200).send({ success: true, allbids })

}))

router.post('/withdraw', verifyToken, asyncerror(async (req, res, next) => {
    if(req.body.amount<200){
        return next(new ErrorHandler('Minimum withdraw 200Inr',405))
    }
    const user = await User.findById(req._id)
    if(user.balance<req.body.amount){
        return next(new ErrorHandler('Not enough balance',405))
    }
    const history = await History.create({ mobile: user.mobile, name: user.name, amount: req.body.amount, type: "withdraw", user_id: req._id })
    let newbalance = user.balance - history.amount
    await User.findByIdAndUpdate(user._id,{
        balance:newbalance
    })
    res.status(200).send({ success: true, history })
}))
router.post('/acceptdeposit', verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const user = await User.findById(req.body.userid)
    const history = await History.create({ mobile: user.mobile, name: user.name, amount: req.body.amount, type: "deposit", user_id: req.body.userid })
    let newbalance = user.balance + history.amount
    await User.findByIdAndUpdate(req.body.userid, {
        balance: newbalance
    })
    await Depositreq.findByIdAndUpdate(req.body.id,{
        status:"Complete"
    })
    res.status(200).send({ success: true, history })
}))
router.post('/rejectdeposit', verifyToken,isadmin, asyncerror(async (req, res, next) => {
    await Depositreq.findByIdAndUpdate(req.body.id,{
        status:"Complete"
    })
    res.status(200).send({ success: true })
}))
router.post('/deposit', verifyToken, asyncerror(async (req, res, next) => {
    const result=await cloudinary.v2.uploader.upload(req.body.proof,{
        folder:"reciept"
    })
   const request=await Depositreq.create({amount:req.body.amount,user_id:req._id,url:result.url,public_id:result.public_id})
    res.status(200).send({ success: true, request })
}))
router.get('/deposit', verifyToken, asyncerror(async (req, res, next) => {
  
   const requests=await Depositreq.find({user_id:req._id})
    res.status(200).send({ success: true, requests })
}))

router.get('/allhistory', verifyToken, asyncerror(async (req, res, next) => {
    const history = await History.find({ user_id: req._id })

    res.status(200).send({ success: true, history })
}))


router.post('/getapikey', asyncerror(async (req, res, next) => {
    const admin=await User.findOne({role:"admin"})
 const apikey=admin.api_key;
 const apiid=admin.api_id;
    res.status(200).send({ success: true ,apiid,apikey })
}))









module.exports = router