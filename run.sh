#! /bin/bash

set -e

if [[ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]]; then
  echo "GOOGLE_APPLICATION_CREDENTIALS is not set"
  exit 1
fi
if [[ -z "$FUSE_DIR" ]]; then
  echo "FUSE_DIR is not set"
  exit 1
fi
if [[ -z "$GCS_BUCKET" ]]; then
  echo "GCS_BUCKET is not set"
  exit 1
fi
if [[ ! -d "$FUSE_DIR" ]]; then
  echo "Creating $FUSE_DIR"
  mkdir -p $FUSE_DIR
fi
if [[ -z "$FUSE_FLAGS" ]]; then
  $FUSE_FLAGS="--implicit-dirs -o allow_other"
fi

echo "Activating service account: $GOOGLE_APPLICATION_CREDENTIALS"
gcloud auth activate-service-account --key-file $GOOGLE_APPLICATION_CREDENTIALS

echo "Mounting $GCS_BUCKET to $FUSE_DIR"
gcsfuse $FUSE_FLAGS --foreground $GCS_BUCKET $FUSE_DIR