import createTemplate from "./create-template";
import AWS from "aws-sdk";
const fs = require("fs");
import axios from "axios";

const bucketName = "bgv-document-check-prod";
// const bucketName="mfe-deploy-test"
const EMAIL = "mohankumar.d@gigin.ai";
const PASSWORD = "admin123";
const BACKEND_URL = "https://verifydev748.gigin.ai/gateway";

const cloudFrontDomain = "d2qmeiuc33eiyk.cloudfront.net";

const generateReportAndSavetoS3 = async (data, destination) => {
  const result = await createTemplate(data);
  return await saveFileToS3("/tmp/report.pdf", destination);
};

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
const fetchReportData = async (id) => {
  const authToken = await getAuthToken();

  const response = await axios.get(
    `${BACKEND_URL}/order-service-request/interim/report/${id}`,
    {
      headers: {
        "x-tenant-name": "gigin",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  console.log(response.data);
  
  if (response.status === 200) {
    return response.data.data;
  }

  throw Error("Unable to generate Data");
};

const upsertReportData = async (data) => {
  const authToken = await getAuthToken();

  const response = await axios.post(`${BACKEND_URL}/report`, data, {
    headers: {
      "x-tenant-name": "gigin",
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  return response.data;
};

const convertCFURLtoS3 = (url) => {
  try {
    const urlObj = new URL(url);
    return `s3://${bucketName}${urlObj.pathname}`;
  } catch (error) {
    console.log(`Invalid URL: ${error.message}`);
    throw Error(`Invalid URL: ${error.message}`);
  }
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

export enum PROGRESS_STATUS {
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
  INPROGRESS = "INPROGRESS",
  PENDING = "PENDING",
  BLOCKED = "BLOCKED",
  CANCELATION_REQUESTED = "CANCELLATION REQUESTED",
}

const saveFileToS3 = async (uploadFilePath, destinationFilePath) => {
  const s3 = new AWS.S3();

  const fileContent = fs.readFileSync(uploadFilePath);

  const data = await s3
    .upload({
      Bucket: bucketName,
      Key: destinationFilePath,
      Body: fileContent,
    })
    .promise();

  return `s3://${bucketName}/${destinationFilePath}`;
};


// const saveZip = async (processId,status) => {
//     const authToken = await getAuthToken();
  
//     const response = await axios.patch(
//       `${BACKEND_URL}/process/${processId}`,
//       {
//         processSystemStatus: status,
//       },
//       {
//         headers: {
//           "x-tenant-name": "gigin",
//           "Content-Type": "application/json", 
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );
  
//     return response.data;
//   };

export const handler = async (event, context) => {
    let req = event;
    if (event["Records"]) {
      req = JSON.parse(event["Records"][0]["body"]);
    }
try{

  const response = {
    orderServiceRequestId: req.orderServiceRequestId,
    processId: req.processId,
    candidateName: req.candidateName,
    tenantId: req.tenantId,
    accountId: req.accountId,
    externalCaseId: req.extCaseId,
    reportVersionId: req.reportVersionId,
    employerName: req.employerName,
    reportId: req.reportId,
    employerId:req.employerId,
    initiatedAt:req.initiatedAt,
    employerEmail:req.employerEmail,
    totalCandidateCount:req.totalCandidateCount,
    documentType:req.documentType
  };

  if (event.url) {
    if(event.url===""){
        throw Error("URL is empty")
    }
    const s3Url = convertCFURLtoS3(event.url);
    response["s3_url"] = s3Url;
    return response;
  }

  if (req.orderServiceRequestId && req.documentType==="report") {
    const reportData = await fetchReportData(req.orderServiceRequestId);
    if (!req.reportId) {
      let upsertReportDataresponse = await upsertReportData({
        orderServiceRequestId: req.orderServiceRequestId,
        status: PROGRESS_STATUS.PENDING,
      });
      const reportId =  upsertReportDataresponse["_id"];

      req.reportId = reportId;
      req.reportVersionId = reportId;

      response["reportId"] = reportId;
      response["reportVersionId"] = reportId;
    }

    const filePath = `${req.tenantId}/${req.accountId}/${req.documentType==="report"?"BGV_REPORT":"CONSENT_FORM"}/${
      req.orderServiceRequestId
    }/${req.reportVersionId}/${
      req.candidateName
    }_${req.documentType==="report"?"Verifyin BGV Report":"Consent Form"}_${req.externalCaseId.substr(
      req.externalCaseId.length - 5
    )}.pdf`;
    const s3Url = await generateReportAndSavetoS3(reportData, filePath);
    await upsertReportData({
      id: req.reportId,
      reportUrl: convertS3ToCFURL(s3Url),
      status: PROGRESS_STATUS.SUCCESS,
    });
    response["s3_url"] = s3Url;
  }else {
    throw Error("Invalid Url")
  }

  return response;
// }catch(e){

//     console.log(e);
//     let upsertReportDataresponse = await upsertReportData({
//         orderServiceRequestId: req.orderServiceRequestId,
//         status: PROGRESS_STATUS.FAIL,
//       });
//     return {}
    
// }
};


// fetchReportData("660cfea322799f43f4971ee9")
