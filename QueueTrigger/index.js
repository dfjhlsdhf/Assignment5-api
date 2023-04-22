const url="https://dataentry-linux.azurewebsites.net/api/callOCR?"
const insertURL="https://dataentry-linux.azurewebsites.net/api/insertDB?"
module.exports = async function (context, myQueueItem) {
    context.log('JavaScript queue trigger function processed work item', myQueueItem);
   
    const data = await fetch(url, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ imageName: myQueueItem })
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          return data;
      })
      .catch(error => console.error(error));
console.log(data);

await fetch(insertURL, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({body: data })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));
  
    
};