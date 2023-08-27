![image](https://github.com/HoangGuruu/DevOps-Hands-On-3rd-RealTime-End-to-End-CI-CD-Docker-Jenkins-Nexus-SonarQube-datree-Helm/assets/111829092/9d9fe5f4-8b3e-43bb-8931-52cc65f1a5c8)


# I. Learn about Service         
1. Maven: In CI/CD I;m use Maven sonarQube plugin which helps in static code analysis and build application code
2. sonarQube: To verify/validate against sonar plugin
3. Jenkins: Integrate all the tool : Gihub, Gradle, SonarQube, Docker, Kubernetes and Datree
4. Docker
5. GitHub
6. Sonatype Nexus : Store Docker Images and Helm Charts
7. Kubernetes: Deploy application on k8s cluster using helm
# II. Step

## 1. Launch Instance
- jenkins
	+ ubuntu
	+ t2.medium
	+ 1x20GiB
- SonarQube
	+ ubuntu 20
	+ t2.medium
	+ 1x20GiB
- Nexus
	+ ubuntu 20
	+ t2.medium
	+ 1x20GiB

## 2 Installation
2.1 jenkins in jenkins EC2
- Check ip:8080 to get in jenkins
- Change SecurityGroup : ALL traffic - 0.0.0.0/0
- 

## 2.2 In SonarQube
- Install docker
[Link tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
[Link document of Docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
 + Do script in socker.sh
- Why use this command ? >> 
```
sudo chmod 777 /var/run/docker.sock
```
 + Then
```
docker run -d --name sonarqube -p 9000:9000 -p 9092:9092 sonarqube
docker container ls
# If it's not do it - [Link](https://gist.github.com/Swiss-Mac-User/8cc5a5e688f1b22d2c17b865649201d8)
```
```
docker pull sonarqube
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
```
- Check in ip:9000
- Change SecurityGroup : All traffic - 0.0.0.0/0
- Log in
admin
admin
- Change password
- 
## 2.3 Nexus
- Install Nexus
[Link](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqazZMajFZMGlBcjA1TzBEU2trVVJJVXQ5TWg3d3xBQ3Jtc0tuMk5jbDdRcHg3UzVZMkVINlVla3dXMnctZ3pIQWxxMnA1UldlTGhEVU9NU2U4cExSc0dPZ1hDaHV2cXhyT2NIR3R1R3ZOV0VvRzBRbHk1SHRrNGpSOGpTSjVTMFdicXktN1FDNWk2SWFka0lrX0Rydw&q=https%3A%2F%2Fwww.howtoforge.com%2Fhow-to-install-and-configure-nexus-repository-manager-on-ubuntu-20-04%2F&v=8KZi7KBpk0I)
```
apt-get update -y

echo "Install Java"
apt-get install openjdk-8-jdk -y
java -version

echo "Install Nexus"
useradd -M -d /opt/nexus -s /bin/bash -r nexus
echo "nexus ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/nexus
mkdir /opt/nexus
wget https://sonatype-download.global.ssl.fastly.net/repository/downloads-prod-group/3/nexus-3.29.2-02-unix.tar.gz
tar xzf nexus-3.29.2-02-unix.tar.gz -C /opt/nexus --strip-components=1
chown -R nexus:nexus /opt/nexus

nano /opt/nexus/bin/nexus.vmoptions
# change .. > . , and if need : memory to 1024
nano /opt/nexus/bin/nexus.rc
# insert user name : nexus


```

- Check ip:8081
- Change SecurityGroup : Alltraffic - 0.0.0.0/0
- Login : admin - with password in ...
- enable ...

## 2.4 Launch Instance
- Master
	+ ubuntu
	+ t3-medium
	+ 1x20GiB
	+ number : 2
-> change 1 in 2 -> Node

```
# Step1:
# On Master & worker node
sudo su
apt-get update
apt-get install docker.io -y
service docker restart
curl -s https://packages.cloud.google.com/apt/doc/apt-key-gpg | apt-get add -
echo"deb http://apt.kubernetes-xenial main"
>/etc/apt/sources.list.d/kubernetes.list
apt-get update
apt install kubeadm=1.20.0-00 kubectl=1.20.0-00 kubelet=1.20.0-00 -y
```

```
# Step2
# On Master:
kubeadm init -pod-network-cldr=192.168.0.0/16
> Copy the token and paste into the worker node
```
```
# Step 3
# On Master
exit
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g)$HOME/.kube/config

```

Step 4
```
# On Master

kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
kubectl apply -f https://rawgithubusercontent.com/kubernetes/ingress-nginx/controller-v0.49.0/deploy/static/provider/baremetal/deploy.yaml
# Then

kubectl get nodes

```

## 2.5 Have a source 
- Then create Jenkinsfile
### Find tutorial 
```
```
- Get in jenkins 
- Manage jenkins - Available Plugin manager
	+ sonar scanner
	+ sonar quality gates
	+ quality gates
	+ sonar gerrit
	+ sonarQube Generic Coverage
	- Install available plugin : docker-pipeline
- Manage jenkins - Configure system
- SonarQube servers / Add
	+ Name : sonar-servers
	+ http://ip:9000
	+ Add credentials
	+ Kind : secret text
	+ In SonarQube -> users -> create token -> then copy this 
	+ secret:...
	+ ID: sonar-token
- In SonarQube/Configuration/webhook
- Create webhook
	+ name : jenkins-webhook
	+ URL : http://ip:8080/sonarqube-webhook/

- In Jenkins
- Create new item
	+ Name: java-webapplication
	+ Pipeline
- Discard old build : choose 3 both days to keep builds and max # ...
- Choose Pipeline script from SCM
	+ Git
	+ Repository : 
	+ main

? Pipeline Sytax
- Choose : withSonarQubeEnv: Prepare SonarQube Scanner environment
- Choose server authentication token : sonar-token
- Copy scripts in Jenkins and fix code then push code to github
- Then it build 

- Check in sonarqube

## 2.6 Change continue Jenkinsfile
- Add stage 
- Use ? Pipeline Sytax to generate code
	+ waitForQualityGate: Wait ......
	+ token : ...
	-> then have code , and copy paste in Jenkinsfile

- Push code and check the change, check sonarqube, stage view
- Add stage docker build ... 
	+ Create Dockerfile
```
FROM maven as build
WORKDIR /app
COPY . .
RUN mvn install

FROM openjdk:11.0
WORKDIR /app
COPY --from=build /app/target/devops-integration.jar /app/
# check in pom.xml
EXPOSE 8080
CMD ["java","-jar","devops-integration.jar"]
```

- Get in instance jenkins to ckeck if exits
sudo su 
cd /var/lib/jenkins/workspace/
ls
- Remember unscripts for docker : not use in this time
- Check with docker
```
docker image ls
docker run -d -p 8081:8080 test-app
docker container ls

```
- Check in ip:8081
- Then {can use with previous hands-on scripts}
```
docker container rm {ID} -f
```
## 2.7 Goto Nexus with ip:8081
- admin : nexus
- repository : create repository
	+ docker : hosted
	+ name : docker-hosted
	+ choose HTTP :8083

- In jenkins instance
```
vi /etc/docker/daemon.json
```
- Add this
```
{ "insecure-registries":["ip:8083"]}
```
```
systemctl restart docker
# then check
docker info
# try 
#	docker login -u nexus-username -p nexus_pass nexus_ip:8083

docker login -u admin -p nexus	ip:8083
```
- Add scripts to Jenkinsfile , part : docker
	+ Check generate : withCredentials:Bind credentials to variables
	+ secret text
	+ nexus_creds
	+ add credentials : nexus_password : nexus
	+ check code in complete Jenkinsfile
- Add environment{ VERSION = "... }
- Git push and check

## 2.8 Configure mail server in Jenkins
- Available plugin : email 
- Configure System : find e-mail notification
	+ smtp.gmail
	+ Avanced : User Name : nthoangthcs@gmail.com
	+ In security in Gmail : App password / create password for app / and add password ->>
	+ use SSL
	+ Choose test email
- Extended E-mail Notification
	+ smtp.gmail.com
	+ port 465
	+ Credentials : Add Username with pasword
	+ use SSL
	+ HTML (text/html)
- add code post{ .. } in Jenkinsfile
```
	post{
		always {
			mail bcc: '', body: "<br>Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br> URL de build: ${env.BUILD_URL}", cc: '', charset: 'UTF-8', from: '', mimeType: 'text/html', replyTo: '', subject: "${currentBuild.result} CI: Project name -> ${env.JOB_NAME}", to: "hoangguruu@gmail.com";  
	}
		}
```
- Then check build

## 2.9 Datree helm installation
- In Jenkins server
```
#!/bin/bash

# HELM INSTALL 

curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3

chmod 700 get_helm.sh

./get_helm.sh

# Datree.io Install 
apt-get install unzip
curl https://get.datree.io | /bin/bash
datree version
datree test <your_kubernetes_manifest_YAML_NAME>
```
- Because first need user jenkins -> so change password for jenkins 
```
su - jenkins
```
- Add stage ('Identifying misconfigs using datree in helm charts')
- Generate scripts / dir:Change current directory
	+ Path : kubernetes/myapp/
	+ Generate ->
	
- Get in datree.io
- Integrate : helm 

- Then run 
```
helm plugin install https://github.com/datreeio/helm-datree
```
- Add Scripts in Jenkinsfile 
```
sh 'helm datree test .'
```
- Then check build
- It's error , so need generate : withEnv: Set environment variables
```
DATREE_TOKEN = {....}
# it in token in datree, when login 
```
- Then check build


- In datree
	+ tick inactive policy
	+ open : prevent service from exposing node port
- Then check - > Fail
	+ close again 

## 2.10 Creating Helm hosted repository in Nexus and Pushing the helm charts
- create repository
- choose helm(hosted)
- Name : helm-repository
- Add satge('Pushing the helm ... ') in Jnekinsfile
- And complete scripts
```
# Check in complete Jenkinsfile
withCredentials([string(credentialsId: 'nexus_paswd',variable:'nexus_creds')]){
	dir('kubernetes/myapp/'){
		sh '''
			helmversion=$(helm show chart myapp | grepversion | cut -d: -f 2 | tr -d ' ')
			tar -czvf myapp-${helmversion}.tgz myapp/
		        curl -u admin:$nexus_password http://nexus_machine_ip:8081/repository/helm-hosted/ --upload-file myapp-${helmversion}.tgz -v
		'''
	}
}
```
- Add how to cut number in version - in Jenkinsfile
- Add tar - to save ...
# 2.11 Adding stage in Jenkinsfile to deploy helm charts on kubernetes cluster, configuration of authenticating k8s cluster from jenkins host & configuring pulling of images from private registry ( nexus ) on kubernetes cluster
- In Jenkin -> Available Plugin : 
	+ Kubernetes Continuous Deploy Plugin
- Dashboard -> Manage Jenkins -> Manage Credentials -> (global) -> Add Credentials
	+ Kubernetes configuration (kubeconfig)
	+ ID: kubernetes-config
	+ Kubeconfig : Tick -> From a file on the Jenkins master : /home/.../kconfig >>> tìm hiểu file này lấy ở đâu
- Use Syntax Jenkins // ChatGPT
- Add stage 
```
stage('Deploying application on k8s cluster') {
            steps {
               script{
                   withCredentials([kubeconfigFile(credentialsId: 'kubernetes-config', variable: 'KUBECONFIG')]) {
                        dir('kubernetes/') {
						  # connect jenkins to kubernetes cluster
                          sh 'helm upgrade --install --set image.repository="34.125.214.226:8083/springapp" --set image.tag="${VERSION}" myjavaapp myapp/ ' 
                        }
                    }
               }
            }
```
- Note {có 1 đoạn command line paste in Master}
- In Mater
```
kubectl get all
```
- Check NodeIp:31629
# 2.12 Adding manual approval stage in Jenkinsfile
- Check in Syntax Jenkins : timeout: Enforce time limit - 10 - Mili...
- Check in google : jenkin input
```
        stage('manual approval'){
            steps{
                script{
                    timeout(10) {
                        mail bcc: '', body: "<br>Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br> Go to build url and approve the deployment request <br> URL de build: ${env.BUILD_URL}", cc: '', charset: 'UTF-8', from: '', mimeType: 'text/html', replyTo: '', subject: "${currentBuild.result} CI: Project name -> ${env.JOB_NAME}", to: "deekshith.snsep@gmail.com";  
                        input(id: "Deploy Gate", message: "Deploy ${params.project_name}?", ok: 'Deploy')
                    }
                }
            }
        }
```

# 2.13 Adding stage to check the application deployment 
- In Master
```
kubectl run curl --image=curlimages/curl -i -rm --restart=Never -- curl {namepod-> myjavaapp-myapp}:8080
```
- Add stage verifying app deployment
```
 stage('verifying app deployment'){
            steps{
                script{
                     withCredentials([kubeconfigFile(credentialsId: 'kubernetes-config', variable: 'KUBECONFIG')]) {
                         sh 'kubectl run curl --image=curlimages/curl -i --rm --restart=Never -- curl myjavaapp-myapp:8080'

                     }
                }
            }
```
# 2.14 Enabling Pull request triggers in Jenkins pipeline Job
- In Jenkin -> Available Plugin : 
	+ Github Pull Request Builder
- Manage Jenkins -> Configure System -> Find : Github Pull Request Builder
- In Github create Personal access tokens
- Then create credentials : User with password - Test basic connect
- Go to Configure : Choose Github Pull Request + Assign Project url for Github project 
- Tick use the Github hook for build triggering
.....
... bla bla 
- Create Webhook to enable auto build when have Pull Request {}
