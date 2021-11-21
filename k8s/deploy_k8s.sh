#!/bin/bash          
cd ../infra
CLUSTER_NAME=$(terraform output kubernetes_cluster_name)
REGION=$(terraform output region)

cd ../k8s
gcloud container clusters get-credentials ${CLUSTER_NAME:1:-1} --region ${REGION:1:-1} 
kubectl config set-context --current --namespace=default
kubectl apply -f .

echo "DONE!"