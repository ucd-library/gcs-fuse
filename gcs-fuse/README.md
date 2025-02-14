# gcs-fuse
Image to create a Google Cloud Storage Fuse mount.

This image is intended to be used alongside other images to provide a way to mount a Google Cloud Storage bucket into a container via a shared volume.

## Usage

Requires to following environment variables:
  - `GCS_BUCKET` - The bucket to mount
  - `FUSE_DIR` - The directory to mount the bucket to
  - `GOOGLE_APPLICATION_CREDENTIALS` - The path to the Google Cloud Service Account key file. This should be mounted into the container.

Optional:
  - `FUSE_FLAGS` - change the flags passed to the `gcsfuse` command. Default is `--implicit-dirs -o allow_other`.  The `--foreground` flag is always added.

Documentation: https://cloud.google.com/storage/docs/cloud-storage-fuse/overview