# Documentation: CI/CD Setup with Jenkins, SonarQube, Docker, MicroK8s, and ArgoCD , And Monitoring with Prometheus/Grafana
## 1. IAM User Configuration
### Provide IAM User access to EC2 with Visual Studio Code.

## 2. Jenkins CI/CD Configuration
### Prerequisites:
- Create an EC2 instance of type t2.medium.
- Allow the following ports: 8080, 8081, 9000, 8000, 80, 443, 22, 9090,3000
{you can custom with your ip instead 0.0.0.0/0}

## 2.1. Jenkins Installation:
### Update the system and install Java:
```
sudo apt update
sudo apt install openjdk-17-jre
java -version

```
### Install Jenkins:
```
curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
  
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
  
sudo apt-get update
sudo apt-get install jenkins

```
## 3. Enable and start Jenkins:
```
sudo systemctl enable jenkins
sudo systemctl start jenkins
sudo systemctl status jenkins

```

## 4. Jenkins Plugin Installation:

- Install the following plugins:
	+ gitlab
	+ gitlab api
	+ sonar scanner
	+ sonar quality gates
	+ quality gates
	+ sonar gerrit
	+ sonarQube Generic Coverage
	+ docker-pipeline

## 5. Jenkins System Configuration:

- Connect Jenkins with GitLab using a token.
- Add SCM configuration.
- Setup webhook for automatic build triggering.

## 6. Maven Installation:
```
sudo apt-get install maven

```

## 2.2. SonarQube Installation:
Prerequisites and Installation:
```
apt install unzip
adduser sonarqube
wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-9.4.0.54424.zip
unzip *
chmod -R 755 /home/sonarqube/sonarqube-9.4.0.54424
chown -R sonarqube:sonarqube /home/sonarqube/sonarqube-9.4.0.54424
cd sonarqube-9.4.0.54424/bin/linux-x86-64/
./sonar.sh start
```
2.3. Docker Installation:
Install Docker:
```
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
- Docker Post Installation:
```
sudo su -
usermod -aG docker jenkins
usermod -aG docker ubuntu
systemctl restart docker

sudo chmod 777 /var/run/docker.sock
```
- Add your application to GitLab.

## 2.4. Jenkins CI/CD Pipeline:
- SonarQube Integration:

- On SonarQube, access via ip:9000, and create a Token.
- In Jenkins, configure SonarQube servers.
- Create a webhook on SonarQube.
- Jenkins Job Configuration:

- Set discard policy to retain only the 3 latest builds and builds younger than 3 days.
- Specify the path to your Jenkinsfile.
- Test the Build:
```
cd java-maven-sonar-argocd-helm-k8s/spring-boot-app
docker build -t hoangguruu/complete-ci-cd:1 .
docker run -d -p 8000:8080 -t hoangguruu/complete-ci-cd:1
```
## 2.5. Jenkinsfile Configuration:
The Jenkinsfile provided in the documentation outlines various stages of the CI/CD pipeline, including checking out the code, building and testing, static code analysis using SonarQube, and more.
## 3. MicroK8s Installation:

```
sudo snap install microk8s --classic
sudo ufw allow in on cni0 && sudo ufw allow out on cni0
sudo ufw default allow routed
sudo usermod -a -G microk8s ubuntu
newgrp microk8s
```
## 3.1. MicroK8s Add-ons:

```
microk8s enable dns 
microk8s enable dashboard
microk8s enable storage
microk8s kubectl get all --all-namespaces
```
## 4. ArgoCD Installation:
Detailed steps are provided for the installation of ArgoCD and its integration with MicroK8s.

- Install ArgoCD by MicroK8s

```
microk8s.kubectl create namespace argocd
microk8s.kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

microk8s.kubectl get all -n argocd

microk8s.kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
microk8s.kubectl get all -n argocd
```
	+ Check with machine_ip:{port}
	+ Login : 
```
microk8s.kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```
- Connect Repo
	+ creat Token
	+ Create Application
	
	+ Remember Path
	
	+ And check
```
microk8s.kubectl get po,svc
microk8s.kubectl get pods
```

## 5. Monitoring with Prometheus and Grafana:
The document concludes with steps to install Prometheus and Grafana for monitoring purposes.

## 5.1 Prometheus
```
microk8s enable helm3

```
```
microk8s.helm3 repo add prometheus-community https://prometheus-community.github.io/helm-charts
microk8s.helm3 repo update

microk8s.helm3 install prometheus prometheus-community/prometheus
microk8s.kubectl expose service prometheus-server --type=NodePort --target-port=9090 --name=prometheus-server-ext

microk8s.kubectl get pods
microk8s.kubectl get svc

```
- Check mymachineip:{port}
## 5.2 Grafana
```
microk8s.helm3 repo add grafana https://grafana.github.io/helm-charts
microk8s.helm3 repo update
microk8s.helm3 install grafana grafana/grafana

microk8s.kubectl get secret --namespace default grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo


microk8s.kubectl expose service grafana --type=NodePort --target-port=3000 --name=grafana-ext

microk8s.kubectl get svc
```
- Check mymachineip:{port}


` Need Elastic Ip`