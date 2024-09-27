import axios from "axios";

const EMAIL = "mohankumar.d@gigin.ai";
const PASSWORD = "admin123";
const BACKEND_URL = "https://verifydev748.gigin.ai/gateway";
const bucketName = "bgv-document-check-prod";
const cloudFrontDomain = "d2qmeiuc33eiyk.cloudfront.net";

const getAuthToken = async () => {
  const credentials = {
    email: EMAIL,
    password: PASSWORD,
  };

  const authResponse = await axios.post(
    `${BACKEND_URL}/auth/signin`,
    credentials,
    {
      headers: {
        "x-tenant-name": "gigin",
        "Content-Type": "application/json",
      },
    }
  );

  const authToken = authResponse.data.auth_token;
  return authToken;
};

const saveZip = async (zipUrl, processId,status) => {
  const authToken = await getAuthToken();

  const response = await axios.patch(
    `${BACKEND_URL}/process/${processId}`,
    {
      processStatus: status,
      result: {
        data: {
          url: convertS3ToCFURL(zipUrl),
        },
      },
    },
    {
      headers: {
        "x-tenant-name": "gigin",
        "Content-Type": "application/json", 
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  return response.data;
};


const convertS3ToCFURL = (s3Uri) => {
    try {
      if (!s3Uri.startsWith("s3://")) {
        throw new Error("Invalid S3 URI format");
      }
  
      // Remove the 's3://' prefix and extract the path after the bucket name
      const path = s3Uri.slice(5 + bucketName.length);
      if (!path.startsWith("/")) {
        throw new Error("Invalid S3 URI structure");
      }
  
      // Build the full CloudFront URL
      const cloudFrontUrl = `https://${cloudFrontDomain}${path}`;
      return cloudFrontUrl;
    } catch (error) {
      console.log(`Error: ${error.message}`);
      throw Error(`Error: ${error.message}`);
    }
  };



const sendEmail=async (subscriberId,report_count,employer_name,download_url,email,documentType)=>{
    let data = JSON.stringify({
        "name": documentType=="report"?"bgvreportsbulkdownload":"bgvconsentbulkdownload",
        "to": {
          "subscriberId":subscriberId,
          "email": email
        },
        "payload": {
          "report_count": report_count,
          "employer_name": employer_name,
          "download_url": download_url,
        }
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.novu.co/v1/events/trigger',
        headers: { 
          'Authorization': 'ApiKey 332165a18e2d45f40ea204c10cdfadd3', 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
     await axios.request(config)
     
}
export const handler = async (event, context) => {
  const zipUrl = event["zipUrl"];
  const processId = event["params"]["processId"];
  const employerId= event["params"]["employerId"]
  const employerEmail= event["params"]["employerEmail"]
  const totalCandidateCount= event["params"]["totalCandidateCount"]
  const employerName= event["params"]["employerName"]
  const documentType= event["params"]["documentType"]
  const failedReportCount= event["params"]["failedReportCount"]
// try{

    await saveZip(zipUrl, processId,"SUCCESS");
    await sendEmail(`novu${employerId}gigin`,failedReportCount===0?`${totalCandidateCount}`:`${(totalCandidateCount-failedReportCount)}/${totalCandidateCount}`,employerName,convertS3ToCFURL(zipUrl),employerEmail,documentType)
    return "Done"
// }

// catch{
//     await saveZip(zipUrl, processId,"FAIL");
// }

};
