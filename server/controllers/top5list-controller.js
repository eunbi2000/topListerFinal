const Top5List = require('../models/top5list-model');

createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Top 5 List',
        })
    }

    const top5List = new Top5List(body);
    console.log(top5List);
    console.log("creating top5List: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({ success: false, error: err })
    }

    top5List
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                top5List: top5List,
                message: 'Top 5 List Created!'
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Top 5 List Not Created!'
            })
        })
}

updateTop5List = async (req, res) => {
    const body = req.body
    console.log(body)
    console.log("updateTop5List: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        top5List.name = body.name
        top5List.items = body.items
        top5List.comments = body.comments
        top5List.published = body.published
        top5List.likedBy = body.likedBy
        top5List.dislikedBy = body.dislikedBy
        top5List.views = body.views
        top5List.publishDate = body.publishDate

        top5List.save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
    })
}

deleteTop5List = async (req, res) => {
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }
        Top5List.findOneAndDelete({ _id: req.params.id }, () => {
            return res.status(200).json({ success: true, data: top5List })
        }).catch(err => console.log(err))
    })
}

getTop5ListById = async (req, res) => {
    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        return res.status(200).json({ success: true, top5List: list })
    }).catch(err => console.log(err))
}
getTop5Lists = async (req, res) => {
    await Top5List.find({}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` })
        }
        return res.status(200).json({ success: true, data: top5Lists })
    }).catch(err => console.log(err))
}
getTop5ListPairs = async (req, res) => {
        await Top5List.find({ }, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists) {
            console.log("!top5Lists.length");
            return res
                .status(404)
                .json({ success: false, error: 'Top 5 Lists not found' })
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];

            for (let key in top5Lists) {
                let list = top5Lists[key];
                let pair = {
                    _id: list._id,
                    name: list.name
                };
                if(req.params.id === list.ownerEmail){
                    pairs.push(pair);
                }
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}

updateCommunityLists = async (req, res) =>{
    await Top5List.find({name: req.params.id, published: true}, (err, top5Lists) => {
        if (err) {
            return res.status(404).json({ success: false, error: err });
        }
        if (!top5Lists){
            return;
        }
        let views = 0
        let likedBy = []
        let dislikedBy = []
        let comments = []
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        console.log(date)
        let publishDate = date

        for(let i = 0;i<top5Lists.length;i++){
            if(top5Lists[i].ownedBy == "Community"){
                console.log(top5Lists[i])
                views = top5Lists[i].views;
                likedBy = top5Lists[i].likedBy;
                dislikedBy = top5Lists[i].dislikedBy;
                comments = top5Lists[i].comments;
                publishDate = top5Lists[i].publishDate
                Top5List.findOneAndDelete({ _id: top5Lists[i]._id }, (err, top5list) => {
                }).catch(err => console.log(err))
                top5Lists.splice(i,1)
                i-=1;
            }
        }

        console.log(top5Lists)
        let items = {};
        for(let i = 0;i<top5Lists.length;i++)
        {
            for(let j = 0;j<5;j++){
                {items[top5Lists[i].items[j]] = items[top5Lists[i].items[j]] ? items[top5Lists[i].items[j]]+(5-j) :(5-j)}
            }
        }
        console.log(items)
        function getSortedKeys(obj) {
            var keys = Object.keys(obj);
            return keys.sort(function(a,b){return obj[b]-obj[a]});
        }
        let freq = getSortedKeys(items);
        let top5ans = []; let votes = [];
        for(let i = 0;i<5;i++)
        {
            top5ans.push(freq[i])
        }
        for(let i = 0;i<5;i++)
        {
            votes.push(items[top5ans[i]])
        }
        console.log(top5ans)
        console.log(votes)
        console.log(views)
      
            const top5List = new Top5List({name: req.params.id, items: top5ans, ownedBy: "Community",comments:comments,
             views: views,published:true, ownerEmail:"Community",
            likedBy:likedBy, dislikedBy:dislikedBy, publishDate: publishDate, published: true, votes: votes}); 
            top5List.save(); 
       
    }).catch(err => console.log(err));
}

module.exports = {
    createTop5List,
    updateTop5List,
    deleteTop5List,
    getTop5Lists,
    getTop5ListPairs,
    getTop5ListById,
    updateCommunityLists
}