import express from 'express';
import exec from 'child_process';
import path from 'path';
import fs from 'fs';
import config from './lib/config.js';

const app = express();

if( !config.buckets ) {
  throw new Error('No BUCKETS environment variable found');
}
if( !config.googleApplicationCredentials ) {
  throw new Error('No GOOGLE_APPLICATION_CREDENTIALS environment variable found');
}
for( let bucket in config.buckets ) {
  if( !path.isAbsolute(config.buckets[bucket]) ) {
    throw new Error(`Path for bucket ${bucket} is not absolute: ${config.buckets[bucket]}`);
  }
}

async function sync(bucket) {
  const path = config.buckets[bucket];
  if (!path) {
    throw new Error(`Bucket registration not found: ${bucket}`);
  }

  if( !fs.existsSync(path) ) {
    console.log('Making directory:', path);
    fs.mkdirSync(path, {recursive: true});
  }

  const cmd = `gsutil -m rsync -r -d gs://${bucket} ${path}`;
  console.log(`Running: ${cmd}`);

  return new Promise((resolve, reject) => {
    let proc = exec.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    proc.stdout.on('data', (data) => {
      console.log(data);
    });
    proc.stderr.on('data', (data) => {
      console.log(data);
    });
    proc.on('close', (code) => {
      console.log(`'${cmd}' exited with code ${code}`);
    });
  });
}

async function activateServiceAccount() {
  const cmd = `gcloud auth activate-service-account --key-file=${config.googleApplicationCredentials}`;
  console.log(`Running: ${cmd}`);

  return new Promise((resolve, reject) => {
    exec.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

app.get('/:bucket', async (req, res) => {
  try {
    const result = await sync(req.params.bucket);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
});

app.listen(config.port, async () => {
  console.log(`Listening on port ${config.port}`);

  await activateServiceAccount();

  for( let bucket in config.buckets ) {
    sync(bucket);
  }
});