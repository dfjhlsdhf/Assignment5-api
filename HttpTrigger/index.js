module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Get the message body from the request
    const message = req.body.message;
    context.bindings.outputQueueItem = 
            (req.query.name || req.body.name);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: message
    };
}