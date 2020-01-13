DOCKER_REGISTRY_SERVER=docker.io
DOCKER_USER=griggheo
DOCKER_EMAIL=grig.gheorghiu@gmail.com
DOCKER_PASSWORD=

kubectl create secret docker-registry myregistrykey \
  --docker-server=$DOCKER_REGISTRY_SERVER \
  --docker-username=$DOCKER_USER \
  --docker-password=$DOCKER_PASSWORD \
  --docker-email=$DOCKER_EMAIL
