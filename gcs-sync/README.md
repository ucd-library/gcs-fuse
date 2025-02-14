# GCS Sync

Service you can use to sync files from Google Cloud Storage and a local directory.  The service will sync files on start as well as provide an http endpoint to sync files on demand.  

The service leverages the [google-cloud/storage](https://www.npmjs.com/package/@google-cloud/storage) rsync subcommand to sync files.  So it will only sync files that have changed or do not exist.  The delete flag is set so that files that have been deleted from the local directory that have been deleted from the bucket.

## Configuration

The service is configured using environment variables.  The following variables are required:

- `BUCKETS` - a comma separated list of bucket to local paths to sync.  Each bucket to path pair is separated by a colon.  For example, `BUCKETS=bucket1:/path1,bucket2:/path2`.
- `GOOGLE_APPLICATION_CREDENTIALS` - the path to the Google Cloud Service Account key file.

Optional variables:

- `PORT` - the port the service will listen on.  Default is `3000`.

## HTTP Endpoint

The service provides an http endpoint to sync files on demand.  The endpoint is a simple `GET` request to `/:bucketName`. For example, to sync files from `bucket1`, you would make a request to `http://localhost:3000/bucket1`.