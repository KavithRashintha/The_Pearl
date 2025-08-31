# awsService.py

import os
import boto3
import uuid
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel
from botocore.client import Config


load_dotenv()

class PresignRequest(BaseModel):
    file_name: str
    file_type: str

router = APIRouter(
    prefix="/api/v1/s3",
    tags=["S3 Uploads"],
)

# Get the region from your .env file
aws_region = os.getenv("AWS_S3_REGION")

# Manually construct the correct regional endpoint URL
s3_endpoint_url = f"https://s3.{aws_region}.amazonaws.com"


s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=aws_region,
    endpoint_url=s3_endpoint_url, # NEW: Forcing the correct endpoint
    config=Config(signature_version='s3v4')
)

BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")

@router.post("/generate-upload-url")
async def create_presigned_url(request: PresignRequest):
    unique_id = uuid.uuid4()
    object_key = f"profile-pictures/{unique_id}-{request.file_name}"

    try:
        presigned_url = s3_client.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': BUCKET_NAME,
                'Key': object_key,
                'ContentType': request.file_type
            },
            ExpiresIn=360
        )

        public_url = f"https://{BUCKET_NAME}.s3.{aws_region}.amazonaws.com/{object_key}"

        return {
            "uploadUrl": presigned_url,
            "publicUrl": public_url,
            "key": object_key
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not generate upload URL: {e}")