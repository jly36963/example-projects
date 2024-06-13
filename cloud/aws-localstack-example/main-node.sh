#!/bin/bash

cd ./node-jobs

# Variables
REPO="node-jobs"
REPO_TAG="${REPO}:latest"
REPO_URI="000000000000.dkr.ecr.us-east-1.localhost.localstack.cloud:4510/${REPO_TAG}"

# ---
# ECR
# ---

function create_ecr_repository {
    aws --endpoint-url=http://localhost:4566 \
        ecr create-repository \
        --repository-name=$1
}
function delete_images_in_ecr_repo {
    ids=$(aws --endpoint-url=http://localhost:4566 ecr list-images --repository-name $1 --query 'imageIds[*]' --output json)

    aws --endpoint-url=http://localhost:4566 \
        ecr batch-delete-image \
        --repository-name $1 \
        --image-ids "$ids"
}
function delete_ecr_repository {
    aws --endpoint-url=http://localhost:4566 \
        ecr delete-repository \
        --repository-name=$1
}
function describe_repositories {
    aws --endpoint-url=http://localhost:4566 \
        ecr describe-repositories
}
function list_ecr_repo_images {
    aws --endpoint-url=http://localhost:4566 \
        ecr list-images \
        --repository-name=$1
}


# ---
# Lambda
# ---

function list_functions {
    aws --endpoint-url=http://localhost:4566 \
        lambda list-functions
}
function get_lambda_func {
    aws --endpoint-url=http://localhost:4566 \
        lambda get-function \
        --function-name $1
}
function invoke_lambda {
    aws --endpoint-url=http://localhost:4566 \
        --cli-read-timeout 10 \
        lambda invoke \
        --function-name $1 \
        --cli-binary-format raw-in-base64-out \
        --payload $2 \
        /dev/stdout
}
function create_lambda {
    aws --endpoint-url=http://localhost:4566 \
        lambda create-function \
        --function-name $1 \
        --package-type Image \
        --code ImageUri=$REPO_URI \
        --handler index.handler \
        --image-config="Command=\"index.handler\"" \
        --timeout 15 \
        --role arn:aws:iam::000000000000:role/lambda-role \
        --environment "Variables={
            NODE_ENV=test
        }"
}
function delete_lambda {
    aws --endpoint-url=http://localhost:4566 \
        lambda delete-function \
        --function-name $1
}

# ---
# Main
# ---

# ECR
echo "Deleting and re-creating ECR repos"
delete_images_in_ecr_repo "$REPO"
delete_ecr_repository "$REPO"
sleep 2
create_ecr_repository "$REPO"
echo "Building the Docker image, pushing it to ECR URL: $REPO_URI"
docker build -t "$REPO_TAG" .
docker image tag "$REPO_TAG" "$REPO_URI"
docker push "$REPO_URI"
docker rmi "$REPO_URI"
echo "Checking ECR repo state after pushing images"
describe_repositories
list_ecr_repo_images "$REPO"

# Lambda
echo "Deleting and re-creating lambda"
delete_lambda "TestNodeJobs"
sleep 2
create_lambda "TestNodeJobs"
echo "Invoking lambda"
invoke_lambda "TestNodeJobs" "{\"job\":\"GET_DATE\",\"variables\":{}}"
