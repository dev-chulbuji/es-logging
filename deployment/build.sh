#!/bin/sh
ENV=$1
APP_ROOT=$(cd $SCRIPT_HOME && pwd)
APP_PATH=$APP_ROOT/src
APP_NAME="logging-app"

get_server_region_by_env() {
case "$ENV" in
  "dev"*)
    echo "ap-northeast-1"
  ;;
  "prod"*)
    echo "ap-northeast-2"
  ;;
esac
}

docker_image_build() {
  local SERVER_REGION="$(get_server_region_by_env)"
  local IAM_ID="657976307134"

  LOGIN_RESULT=`aws ecr get-login --no-include-email --region ${SERVER_REGION}`
  ($LOGIN_RESULT)

  # (cd $APP_PATH && cp ~/.ssh/flitto_git.pem ./id_rsa)

  if ! (cd $APP_PATH; docker build -t ${APP_NAME} .); then
    # (cd $APP_PATH; rm ./id_rsa)
    echo "Error occur during docker build" >&2
    exit 1
  fi

  # (cd $APP_PATH; rm ./id_rsa)
  IMAGE_ID=$(docker images ${APP_NAME}:latest -q)
  IMAGE_URL="${}.dkr.ecr.${SERVER_REGION}.amazonaws.com/${APP_NAME}"

  (docker tag ${APP_NAME}:latest ${IMAGE_URL}:latest)
  (docker tag ${APP_NAME}:latest ${IMAGE_URL}:${IMAGE_ID})

  (docker push ${IMAGE_URL}:latest)
  (docker push ${IMAGE_URL}:${IMAGE_ID})
}

test() {
  echo "#### run test code ####"
  (cd $APP_PATH && npm run test)
}


case "$STEP" in
  "docker_image_build" )
    exit_if_fail docker_image_build
    ;;
  "test" )
    exit_if_fail test
    ;;
esac