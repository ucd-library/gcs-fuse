import express from 'express';
import exec from 'child_process';
import path from 'path';
import config from './config';

const app = express();

if( !config.buckets ) {
  throw new Error('No BUCKETS environment variable found');
}
for( let bucket in config.buckets ) {
  if( !path.isAbsolute(config.buckets[bucket]) ) {
    throw new Error(`Path for bucket ${bucket} is not absolute: ${config.buckets[bucket]}`);
  }
}

async function sync(bucket) {
  const path = config.buckets[bucket];
  if (!path) {
    throw new Error(`No path found for bucket: ${bucket}`);
  }

  const cmd = `gsutil -m rsync -r -d gs://${bucket} ${path}`;
  console.log(`Running: ${cmd}`);

  return new Promise((resolve, reject) => {
    exec.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log({cmd, stdout, stderr});
        resolve({stdout, stderr});
      }
    });
  });
}

app.get('/:bucket', async (req, res) => {
  try {
    const result = await sync(req.params.bucket);
    res.json(result);
  } catch (error) {
    res.status(500).json({error});
  }
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);

  for( let bucket in config.buckets ) {
    sync(bucket);
  }
});