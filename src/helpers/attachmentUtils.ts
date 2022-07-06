import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

const s3 = new XAWS.S3({
    signatureVersion: 'v4',
});

const todoBucket = process.env.ATTACHMENT_S3_BUCKET;

export function uploadAttachment(todoId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: todoBucket,
      Key: todoId,
      Expires: 300
    })}


// export async function deleteAttachment(todoId: string): Promise<void> {
//     s3.deleteObject({
//         Bucket: todoBucket,
//         Key: todoId,
//     }).promise();
// }