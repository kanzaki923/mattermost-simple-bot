import express, { Application, Request, Response } from 'express';
import request from 'request';

const app: Application = express();
app.use(express.urlencoded({ extended: true }));

const port: number = 3000;

app.get('/health', (req: Request, res: Response) => {
    res.send('Hello');
})

// outgoing webhook
app.post("/", (req: Request, res: Response) => {
    const outhookData = req.body;
    postMessage(outhookData);

    res.send();
});


// incoming webhook
const postMessage = (outhookData: any) => {
    // https://developers.mattermost.com/integrate/reference/message-attachments/
    const options = {
        uri: 'http://XXXXX',
        json: {
            "text": "@user1 text contents",
            // "channel": "xxxxx",
            "attachments": [
                {
                    "fallback": "text contents ",
                    "color": "#FF8000",
                    "pretext": "PreText",
                    // "author_name": `${body.user_name}`,
                    // "author_icon": "https://mattermost.com/wp-content/uploads/2022/02/icon_WS.png",
                    // "author_link": "https://mattermost.org/",
                    "title": `${outhookData.user_name}からのメンション`,
                    "title_link": `http://{url}/{team}/pl/${outhookData.post_id}`,
                    "fields": [
                        {
                            "short": false,
                            "title": "本文",
                            "value": `${outhookData.text.replace(/^@hoge\s+/g, "")}`
                        },
                        {
                            "short": true,
                            "title": "本文2",
                            "value": `${outhookData.channel_name}`
                        },
                        {
                            "short": true,
                            "title": "日時",
                            "value": (new Date()).toLocaleString('ja-jp', { timeZone: 'JST' })

                        },
                        {
                            "short": false,
                            "title": "user",
                            "value": "@user1 "
                        }
                    ],
                    // "image_url": "https://mattermost.com/wp-content/uploads/2022/02/icon_WS.png"
                }
            ]

        },
        method: 'POST',

    };

    // send
    request.post(options, function (error, res, body) {
        if (error) {
            console.error(error)
        }
    });
}

app.listen(port, function () {
    console.log(`App is listening on port ${port}!`)
})
