#!/bin/bash

# ---
# S3
# ---

function create_bucket {
    aws --endpoint-url=http://localhost:4566 \
        s3api create-bucket \
        --bucket $1
}
function delete_bucket {
    aws --endpoint-url=http://localhost:4566 \
        s3api delete-bucket \
        --bucket $1
}
function put_object {
    aws --endpoint-url=http://localhost:4566 \
        s3api put-object \
        --bucket $1 \
        --key $2 \
        --body $3
}
function delete_object {
    aws --endpoint-url=http://localhost:4566 \
        s3api delete-object \
        --bucket $1 \
        --key $2
}
function list_objects_v2 {
    aws --endpoint-url=http://localhost:4566 \
        s3api list-objects-v2 \
        --bucket $1
}
function get_object {
    aws --endpoint-url=http://localhost:4566 \
        s3api get-object \
        --bucket $1 \
        --key $2 \
        $3
}


# ---
# Main
# ---

# S3
echo "Deleting and re-creating bucket"
delete_object "my-bucket" "data.json"
delete_bucket "my-bucket"
create_bucket "my-bucket"
echo "Putting object in bucket"
put_object "my-bucket" "data.json" "data.json"
echo "Examining bucket and contents"
list_objects_v2 "my-bucket"
get_object "my-bucket" "data.json" "data-copy.json"
echo "Reading contents of read/copied file"
cat "data-copy.json"
echo "Removing read/copied file"
rm "data-copy.json"
