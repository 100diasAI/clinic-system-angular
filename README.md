# Clinic System Angular

Clone the repository and navigate to the project directory

```bash
git clone https://github.com/100diasAI/clinic-system-angular.git &&
cd clinic-system-angular
```

## Running project locally

### Prerequisites

- Node.js 20.x or higher
- npm
- Angular CLI 18.x or higher

### Setup

1. Install the dependencies

```bash
npm i
```

### Running the Project

1. Run the following command to start the application:

```bash
ng serve
```

2. Open the browser and navigate to `http://localhost:4200/`
3. The application should be running

## Deployment to Kubernetes

### Prerequisites

- Docker deamon, example:
  [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Kubernetes cluster, example: Docker Desktop Kubernetes, Minikube

### Setup

1. Add angular app host to the hosts file

```bash
sudo echo '127.0.0.1       angular.clinic.system.com'
>> ~/etc/hosts
```

2. Build the Docker image

```bash
docker build . -t clinic-system-angular:0.0.3
```

3. Deploy the image to the Kubernetes cluster

```bash
kubectl apply -f k8s/deployment.yaml
```

### Running the Project

1. Open the browser and navigate to `http://angular.clinic.system.com/`
2. The application should be running
