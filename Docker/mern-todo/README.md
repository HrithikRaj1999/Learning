# MERN Todo Kubernetes Lab

Small MERN Todo app for local Kubernetes practice on Docker Desktop.

## Stack

- MongoDB
- Express + Node backend
- React frontend (served by Nginx)
- Kubernetes manifests with init container and HPA

## Project structure

- backend: API service
- frontend: React app
- k8s: Kubernetes manifests

## Prerequisites

- Docker Desktop with Kubernetes enabled
- kubectl

## Build images

Run from the project root (`mern-todo`):

```powershell
docker build -t mern-backend:local ./backend
docker build -t mern-frontend:local ./frontend
```

## Deploy

```powershell
kubectl apply -k ./k8s
kubectl get all -n mern-lab
```

Open the app:

- http://localhost:30080

## Verify health

```powershell
kubectl get pods -n mern-lab
kubectl logs deploy/backend -n mern-lab
kubectl get hpa -n mern-lab
```

## Failure drills

### 1) Bad backend image (rollout failure)

```powershell
kubectl set image deploy/backend backend=mern-backend:notfound -n mern-lab
kubectl rollout status deploy/backend -n mern-lab
kubectl describe pod -n mern-lab -l app=backend
```

Fix:

```powershell
kubectl rollout undo deploy/backend -n mern-lab
```

### 2) Mongo outage (dependency failure)

```powershell
kubectl scale deploy/mongo --replicas=0 -n mern-lab
kubectl get pods -n mern-lab
kubectl logs deploy/backend -n mern-lab
```

Fix:

```powershell
kubectl scale deploy/mongo --replicas=1 -n mern-lab
```

### 3) Force CPU load to trigger HPA

Create a load pod:

```powershell
kubectl run loadgen -n mern-lab --rm -it --image=busybox -- sh
```

Inside loadgen:

```sh
while true; do wget -q -O- http://backend:5000/health; done
```

In another terminal:

```powershell
kubectl get hpa,pods -n mern-lab -w
```

Stop loadgen with Ctrl+C and watch scale down.

## Cleanup

```powershell
kubectl delete -k ./k8s
```
