var gplay = require('google-play-scraper');
const url = require('url');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Axios = require('axios');

router.post('/appDetail', auth, async(req, res) => {
    const result = await gplay.reviews({
        appId: req.body.appurl,
        sort: gplay.sort.NEWEST,
        num: 5,
    });
    res.json({
        data: result.data,
    });
});

router.post('/sendtoslack', async function(req, res, next) {

    const {
        slackData
    } = req.body;
    Promise.all(slackData.map(i => {
            Axios.post(req.body.slackUrl, {
                blocks: [{
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `
                   *User Name*   ${i.userName}\n*Stars Given*   ${i.score}   *Date* ${new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                }).format(new Date(Date.parse(i.date)))}\n*Review* ${i.text}`,
                    },
                }, ],
            })
        })).then(
            res => console.log(res)
        )
        .catch(err => {
            console.log(err)
        })
});

module.exports = router;