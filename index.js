const express = require("express");
const { doSomeHavyTask } = require('./utils');
const client = require('prom-client');
const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const app = express();

const PORT = 8000;


// logs matrics
const options = {
    transports: [
        new LokiTransport({
            labels: {
                appName: 'Express'
            },
            host: "http://127.0.0.1:3100"
        })
    ]
};


const logger = createLogger(options);

// matrices
const collectDefaultMetrics = client.collectDefaultMetrics;
// const Registry = client.Registry;
// const register = new Registry();
collectDefaultMetrics({ register: client.register });


app.get("/", (req, res) => {
    logger.info('Req came on / router');
    return res.status(200).json({ message: "helo from nodejs server" })
})

app.get("/slow", async (req, res) => {
    logger.info('Req came on /slow router')
    try {
        const timeTaken = await doSomeHavyTask();
        return res.status(500).json({ status: "Success", error: `havy task completed in ${timeTaken} seconds` })
    } catch (error) {
        logger.error(error.message)
        return res.status(200).json({ status: "Error", error: "Internal server error" })

    }
})


app.get("/metrics", async (req, res) => {
    res.setHeader('Content-Type', client.register.contentType);
    const matrics = await client.register.metrics();
    res.send(matrics);
})

app.listen(PORT, () => {
    console.log('server listening on port ' + PORT);
})