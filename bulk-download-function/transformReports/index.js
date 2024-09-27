export const handler = async (event,context) => {
    const bucketName = "bgv-document-check-prod";
    
    const urls=[]
    const response = {}
    event.map(ev=>{
      if(Object.keys(ev).length)
      {
        urls.push(ev.s3_url)
        response["params"]=ev
      }
    })
    
     const filePath = `${response["params"].tenantId}/${response["params"].accountId}/${response["params"].documentType==="report"?"BGV_REPORT":"CONSENT_FORM"}/${response["params"].processId}/${response["params"].documentType==="report"?"Verifyin BGV Reports_":"Consent forms_"}${response["params"].initiatedAt}.zip`;
     
     const failedReportCount = response["params"].totalCandidateCount-urls.length
     console.log(response["params"].totalCandidateCount)
  
    response["s3_urls"]=urls
    response["destination_file_path"]=filePath
    response["destination_bucket"]=bucketName
    response["params"]["failedReportCount"]=failedReportCount
    return response;
  };
  