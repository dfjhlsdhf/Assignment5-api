const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const key ="a5c11d85516840cd8da10bc86b02b615";
const endpoint = "https://dataentry-cv.cognitiveservices.azure.com/";
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);
async function readTextFromURL(client, url) {
        // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
        let result = await client.read(url);
        // Operation ID is last path segment of operationLocation (a URL)
        let operation = result.operationLocation.split('/').slice(-1)[0];

        // Wait for read recognition to complete
        // result.status is initially undefined, since it's the result of read
        while (result.status !== "succeeded") { await sleep(1000); result = await client.getReadResult(operation); }
        return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
      }
//   function printRecText(readResults) {
//     console.log('Recognized text:');
//     for (const page in readResults) {
//       if (readResults.length > 1) {
//         console.log(`==== Page: ${page}`);
//       }
//       const result = readResults[page];
//       if (result.lines.length) {
//         for (const line of result.lines) {
//           console.log(line.words.map(w => w.text).join(' '));
//         }
//       }
//       else { console.log('No recognized text.'); }
//     }
//   }
function printRecText(readResults) {
    const output = [];
    for (const page in readResults) {
      const pageOutput = { page: parseInt(page) + 1, lines: [] };
      const result = readResults[page];
      if (result.lines.length) {
        for (const line of result.lines) {
          pageOutput.lines.push({ text: line.words.map(w => w.text).join(' ') });
        }
      }
      else {
        pageOutput.lines.push({ text: 'No recognized text.' });
      }
      output.push(pageOutput);
    }
    console.log(JSON.stringify(output, null, 2));
    return output
  }
  
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const printedTextSampleURL = 'https://dataimagesstorage.blob.core.windows.net/uploaded/'+req.body.imageName;
    console.log('Read printed text from URL...', printedTextSampleURL.split('/').pop());
    const printedResult = await readTextFromURL(computerVisionClient, printedTextSampleURL);
    printRecText(printedResult);

    const responseMessage =printRecText(printedResult)
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
    return responseMessage;
}