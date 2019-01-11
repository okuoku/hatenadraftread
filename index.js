const MAXPAGE = 12;
const hatena_username = "mjt";
// Acquire key at https://www.hatena.ne.jp/{{USERNAME}}/config/mail/upload
const hatena_apitoken = "XXXXXXXXXX";
// See AtomPub API at http://developer.hatena.ne.jp/ja/documents/diary/apis/atom
// See WSSE API at http://developer.hatena.ne.jp/ja/documents/auth/apis/wsse

const wsse = require("wsse");
const rp = require("request-promise-native");
const fs = require("fs");

var token = wsse({username: hatena_username, password: hatena_apitoken});

var page = 1;

async function readpage(page){
    let options = {
        url: "http://d.hatena.ne.jp/" + hatena_username + "/atom/draft?page=" + page.toString(),
        method: "GET",
        headers: {
            "X-WSSE": token.getWSSEHeader()
        }
    };
    console.log(options.url);
    const res = await rp(options);
    return res;
}

function doread(page){
    readpage(page).then(content => {
        fs.writeFileSync("page" + page.toString() + ".xml", content, "utf-8");
        if(page != MAXPAGE){
            doread(page+1);
        }
    });
}

doread(1);
