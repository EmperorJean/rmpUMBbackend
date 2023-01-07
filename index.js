const cheerio = require("cheerio")
const axios = require("axios")
const express = require('express');
const app = express();
const UNI = 3980;
const data = require('./data.json')
var json = {}


app.get('/rmp/:id', async (req, res) => {

    let par = req.params.id
 
    let prof = par.includes('.') ? await extract(par, true) : await extract(par, false)

    if (!prof.length) {
        return res.json({ "result": "Error" })
    }
    await main(prof[0].profId)

    setTimeout((() => {
        res.json(json)
    }), 500)
    //res.json({"result": "success"})
})

app.listen(3001, () => {
    console.log('Hello from port 3001')
})

async function extract(id, nf) { 
    if(nf)
    {
        let name = id.split(' ');
        let last = name[0].includes('.') ? name[name.length - 1].toLowerCase() : name[name.length - 1].toLowerCase().charAt(0)
        let first = name[0].includes('.') ? name[0].charAt(0).toLowerCase() : name[0]
        
        return name[0].includes('.') ?  await data.data.filter(rec => (rec.name.toLowerCase().split(' ')[rec.name.toLowerCase().split(' ').length - 1] === last && rec.name.toLowerCase().split(' ')[0].charAt(0) === first) ) : await data.data.filter(rec => (rec.name.toLowerCase().split(' ')[rec.name.toLowerCase().split(' ').length - 1].charAt(0) === last && rec.name.toLowerCase().split(' ')[0] === first.toLowerCase()) )  

    }
    return await data.data.filter(rec => rec.name.toLowerCase() === (id.toLowerCase())) 
}
async function main(id) {
    // if(isNaN(id))
    // {
    //     let prof = await PROF.findOne({profName: id})

    //     if(!prof) {
    //         return json = {result: ["not found"]}
    //     }else{
    //             id = prof.profId;
    //     }
    // }

    axios.get(`https://www.ratemyprofessors.com/professor?tid=${id}`)
        .then(urlRes => {
            const $ = cheerio.load(urlRes.data);
            var res = {}
            var inner = {}

            let arr = [];
            res["name"] = `${$("#root > div > div > div.PageWrapper__StyledPageWrapper-sc-3p8f0h-0.cCBygY > div.TeacherRatingsPage__TeacherBlock-sc-1gyr13u-1.jMpSNb > div.TeacherInfo__StyledTeacher-ti1fio-1.kFNvIp > div:nth-child(2) > div.NameTitle__Name-dowf0z-0.cfjPUG > span:nth-child(1)").text()} ${$("#root > div > div > div.PageWrapper__StyledPageWrapper-sc-3p8f0h-0.cCBygY > div.TeacherRatingsPage__TeacherBlock-sc-1gyr13u-1.jMpSNb > div.TeacherInfo__StyledTeacher-ti1fio-1.kFNvIp > div:nth-child(2) > div.NameTitle__Name-dowf0z-0.cfjPUG > span.NameTitle__LastNameWrapper-dowf0z-2.glXOHH").text()}`
            res['rating'] = `${$("#root > div > div > div.PageWrapper__StyledPageWrapper-sc-3p8f0h-0.cCBygY > div.TeacherRatingsPage__TeacherBlock-sc-1gyr13u-1.jMpSNb > div.TeacherInfo__StyledTeacher-ti1fio-1.kFNvIp > div:nth-child(1) > div.RatingValue__AvgRating-qw8sqy-1.gIgExh > div > div.RatingValue__Numerator-qw8sqy-2.liyUjw").text()}/5`
            res['wta'] = `${$("#root > div > div > div.PageWrapper__StyledPageWrapper-sc-3p8f0h-0.cCBygY > div.TeacherRatingsPage__TeacherBlock-sc-1gyr13u-1.jMpSNb > div.TeacherInfo__StyledTeacher-ti1fio-1.kFNvIp > div.TeacherFeedback__StyledTeacherFeedback-gzhlj7-0.cxVUGc > div:nth-child(1) > div.FeedbackItem__FeedbackNumber-uof32n-1.kkESWs").text()}`
            res['level'] = `${$("#root > div > div > div.PageWrapper__StyledPageWrapper-sc-3p8f0h-0.cCBygY > div.TeacherRatingsPage__TeacherBlock-sc-1gyr13u-1.jMpSNb > div.TeacherInfo__StyledTeacher-ti1fio-1.kFNvIp > div.TeacherFeedback__StyledTeacherFeedback-gzhlj7-0.cxVUGc > div:nth-child(2) > div.FeedbackItem__FeedbackNumber-uof32n-1.kkESWs").text()}`
            res['totalRatings'] = `${$("#root > div > div > div.PageWrapper__StyledPageWrapper-sc-3p8f0h-0.cCBygY > div.TeacherRatingsPage__TeacherBlock-sc-1gyr13u-1.jMpSNb > div.TeacherInfo__StyledTeacher-ti1fio-1.kFNvIp > div:nth-child(1) > div.RatingValue__NumRatings-qw8sqy-0.jMkisx > div > a").text()}`
            res['link'] = `https://www.ratemyprofessors.com/professor?tid=${id}`
            let count = 0;

            $("#ratingsList  li > div > div > div.Rating__RatingInfo-sc-1rhvpxz-3.kEVEoU").each((i, elm) => {

                count++;
                $(elm).children().each((id, el) => {
                    if ($(el).children().length > 1) {
                        $(el).children().each((idd, e) => {
                            var classList = $(e).attr("class");
                            var classArr = classList.split('_');

                            // arr.push($(e).text())
                            if (classArr[0] === "Comments") {
                                arr.push($(e).text().replace(/\n/g, ''))
                            }
                        })
                    } else {
                        // arr.push($(el).text())
                        var classList = $(el).attr("class");
                        var classArr = classList.split('_');

                        // arr.push($(e).text())
                        if (classArr[0] === "Comments") {
                            arr.push($(el).text().replace(/\n/g, ''))
                        }
                    }
                })

            })
            //res.push({stats: arr});
            inner["info"] = res;
            inner["comments"] = arr;
            json["result"] = (inner);
        })
}
