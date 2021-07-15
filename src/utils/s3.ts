import AWS from 'aws-sdk';

AWS.config.getCredentials((err) => {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log('Access key:', AWS.config.credentials!.accessKeyId);
  }
});

AWS.config.update({
  signatureVersion: 'version',
  region: 'fr-par',
});

export default new AWS.S3({
  apiVersion: 'latest',
  signatureVersion: 'v4',
  endpoint: 'https://s3.fr-par.scw.cloud',
});
