const {MongoClient}=require("mongodb")
const url="mongodb://warehouse-record:cQKitrO8QOvmVOWiyl3NlaG9HQSEoU1uj37EN0VHpgHgrJx3A1o2rgCmlknwyrGwNfEZGUGe7dRtACDbcivNvw%3D%3D@warehouse-record.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@warehouse-record@"
const client=new MongoClient(url)
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    await client.connect();
    const database=client.db("dataentryRecord")
    const collection=database.collection("record")
    const newRecord=req.body
    await collection.insertOne(newRecord)
    context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Insert is done"
    };
    context.log.info("Create complete")
}