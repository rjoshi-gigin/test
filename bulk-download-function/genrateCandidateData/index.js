console.log('Loading function');

export const handler = async (event, context) => {
    let data=JSON.parse(event["Records"][0]["body"])
   
    return data
};