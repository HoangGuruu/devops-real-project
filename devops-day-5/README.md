# DevOps-Hands-On-5th-Deployment-On-Kubernetes-Cluster-with-Jenkins-CI-CD-GitHub-Docker-Ansible
## [Link tutorial](https://www.youtube.com/playlist?list=PLLu1bCv5AByGUZUl4N2fhZdtHg0pd7G8E)

## 1.  Server Setup and Installation
- Setup Server and Installation
- Launch Ubuntu EC2
	+ t2.micro
	+ number : 2 instances |Jenkins Server | Ansible Server
	+ Size : 10 GIB
	+ Allow : all traffic
	
	+ t2.medium
	+ number : 1 | WebApp Server
	+ All traffic

## Connect and Installation
- In Jenkins Server
	+ Install Jenkins
	+ In Jenkins : Install Available Plugin : SSH Agent
	+ Restart Jenkins
- In Ansible Server
	+ Install Ansible : with ansible.sh | [Link](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-ansible-on-ubuntu-20-04)
	+ Install Docker
	+ Install Python
- In WebApp Server
	+ Install docker | minikube ( kubernetes cluster )
	+ Use docker.sh | minikube.sh { then run ... follow install tutorial}
	+ [Link install minikube](https://phoenixnap.com/kb/install-minikube-on-ubuntu)
	+ [Link all script](https://github.com/vikash-kumar01/installation_scripts/tree/master)
```
kubectl get nodes
```	
## 2. Dockerfile | Configure Webhook | Trigger Jenkins Job
- You have Dockerfile
```
FROM centos:latest
RUN yum install -y httpd \
 zip\
 unzip
ADD {link-project.zip} /var/www/html/
WORKDIR /var/www/html/
RUN unzip photogenic.zip
RUN cp -rvf photogenic/* .
RUN rm -rf photogenic photogenic.zip
CMD ["/usr/sbin/httpd","-D","FOREGROUND"]
EXPOSE 80 22
```

```
# Interesting Command line: 
# If you don't want to clone code 
git add .
git commit -m ""
git remote add origin {link url}
git push origin master
```
- In Jenkins Server : Create new item | With Pipeline
	+ Add code to pipeline script
```
node {
	stage('Git checkout'){
		git '{link url github}'
	}
}
```
- Use Pipe sytax to check 
	+ Choose : Git 
		+ You can generate credential .... 
	+ Then Generate Pipeline Script | And copy to Jenkins Script
- Then apply and Save
- Then Build Now
- Cd to Jenkins workspace to check
- Get in configure : Tick Github hook trigger for GITScm polling
- Setting Webhook in GitHub
	+ Get in configure - API Token : Generate API Token
	+ application/json
	+ Copy Token API and paste into Secret

- Then check to change code : Add port to allow

## 3. Transfer & Execute files on remote server using SSH Agent
- In configure Jenkins - Pipeline
	+ Add stage
```
node {
	stage('Git checkout'){
		git '{link url github}'
	}
	stage('sending docker file to Ansible over ssh'){
		sshagent(['ansible_demo']){
		    sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private'
		    sh 'scp	/var/lib/jenkins/workspace/pipeline_demo/* ubuntu@ip_ansible_private:/home/ubuntu'
		}
	}
}
```
- Use Pipeline Syntax : choose sshagent:SSH Agent
	+ Add Key Jenkins
	+ ID :ansible_demo
	+ user : ubuntu 
	+ Add key : Use sshkeygen {ansible}	
	>> Generate Code
- And add code in pipeline - Apply
- Check status pipeline

- Get in Ansible Server
```
cd home/ubuntu/
rm Dockerfile
ls
# Then wait a minutes
ls
# The Dockerfile will create again
```

# 5. Build docker Images using Dockerfile | Tag docker images
- In Jenkins Configure : Pipeline
	+ Add stage
```
node {
	stage('Git checkout'){
		git '{link url github}'
	}
	stage('sending docker file to Ansible over ssh'){
		sshagent(['ansible_demo']){
		    sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private'
		    sh 'scp	/var/lib/jenkins/workspace/pipeline_demo/* ubuntu@ip_ansible_private:/home/ubuntu'
		{
	}
	stage('Docker Build Image'){
		sshagent(['ansible_demo']){
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private cd /home/ubuntu/'
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image build -t $JOB_NAME:v1.$BUILD_ID .'
		}
		
	}
}
```
- Use Pipeline Syntax
- Check in Ansible Server
```
docker image ls
```
- Then 
```
node {
	stage('Git checkout'){
		git '{link url github}'
	}
	stage('sending docker file to Ansible over ssh'){
		sshagent(['ansible_demo']){
		    sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private'
		    sh 'scp	/var/lib/jenkins/workspace/pipeline_demo/* ubuntu@ip_ansible_private:/home/ubuntu'
		{
	}
	stage('Docker Build Image'){
		sshagent(['ansible_demo']){
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private cd /home/ubuntu/'
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image build -t $JOB_NAME:v1.$BUILD_ID .'
		}
		
	}
	stage('Docker image tagging'){
		sshagent(['ansible_demo']){
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private cd /home/ubuntu/'
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image tag $JOB_NAME:v1.$BUILD_ID {NameInDockerBub}/$JOB_NAME:v1.$BUILD_ID'
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image tag $JOB_NAME:v1.$BUILD_ID {NameInDockerBub}/$JOB_NAME:latest'
		}
	}
}
```
- Build and Check
# 6. Push Images to DockerHub
- In Jenkins Configure : Build Trigger / Pipeline
```
node {
	stage('Git checkout'){
		git '{link url github}'
	}
	stage('sending docker file to Ansible over ssh'){
		sshagent(['ansible_demo']){
		    sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private'
		    sh 'scp	/var/lib/jenkins/workspace/pipeline_demo/* ubuntu@ip_ansible_private:/home/ubuntu'
		{
	}
	stage('Docker Build Image'){
		sshagent(['ansible_demo']){
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private cd /home/ubuntu/'
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image build -t $JOB_NAME:v1.$BUILD_ID .'
		}
		
	}
	stage('Docker image tagging'){
		sshagent(['ansible_demo']){
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private cd /home/ubuntu/'
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image tag $JOB_NAME:v1.$BUILD_ID {NameInDockerBub}/$JOB_NAME:v1.$BUILD_ID'
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image tag $JOB_NAME:v1.$BUILD_ID {NameInDockerBub}/$JOB_NAME:latest'
		}
	}
	stage('Push docker images to docker hub'){
		sshagent(['ansible_demo']){
			withCredentials([string(credentialsId: ''dockerhub_passwd',variable:'dockerhub_passwd')]){
				sh "ssh -o StrictHostKeyChecking=no docker login -u {name dockerhub} -p ${dockerhub_passwd}"
				sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image push {NameInDockerBub}/$JOB_NAME:v1.$BUILD_ID'
				sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image push {NameInDockerBub}/$JOB_NAME:latest'
			
			}
		}
	}
}
```
- Use Jenkins Syntax
	+ sshagent:SSH Agent
	+ withCredentials: Bind credentials to variables
		+ Add Secret text
		- dockerhub_password
			+ Secret text
			+ dockerhub_password
- Then build and check

# 7. Complete Real-time Deployment on Kubernetes cluster using jenkins CI/CD final Video
- In Repository You need Add : Deployment.yml | Service.yml | ansible.yml
- Link of Repository : [Link]()
- Deployment.yml
```
kind: Deployment
apiVersion: apps/v1
metadata:
   name: mrdevops
spec:
   replicas: 2
   selector:      # tells the controller which pods to watch/belong to
    matchLabels:
     app: mrdevops
   template:
      metadata:
        labels:
          app: mrdevops
      spec:
       containers:
        - name: mrdevops
          image: vikashashoke/pipeline-demo
          imagePullPolicy: Always
          ports:
          - containerPort: 80
```
- Service.yml
```
kind: Service                             
apiVersion: v1
metadata:
  name: mrdevops
  labels:
    app: mrdevops
spec:
  ports:
    - port: 8080                               
      targetPort: 80                    
      nodePort: 31200
  selector:
    app: mrdevops                    
  type: LoadBalancer 
```
- ansible.yml
```
- hosts: all
  become: true
  tasks: 
    # - name: delete old deployment
    #   command: kubectl delete -f /home/ubuntu/Deployment.yml
    # - name: delete old service
    #   command: kubectl delete -f /home/ubuntu/Service.yml
     - name: create new deployment
       command: kubectl apply -f /home/ubuntu/Deployment.yml
     - name: create new service
       command: kubectl apply -f /home/ubuntu/Service.yml
```

- Get in Kubernetes Cluster 
	+ Setting password
```
passwd root
vi /etc/ssh/sshd
```
	+ Then check
```
PermitRootLogin yes

PasswordAuthentication yes

```
```
service sshd restart
```
- Get in Ansible Server 
```
ssh-keygen
ssh-copy-id -i root@{ip-webapp(Kubernetes)}
```
	+ Try
```
ssh root@{ip-webapp()}
```
-> Check ansible and Install Ansible
```
ls
# to install ansible in webapp server{ssh}
sh ansible.sh
ansible --version
vi /etc/ansible/hosts
```
	+ Add command line
```
[node]
{ip-webapp}
```
- Then use module ping to ping
```
ansible -m ping node
ansible -m ping {ip-webapp}
```
- Go to Jenkins Configure - Add stage
```
node {
	stage('Git checkout'){
		git '{link url github}'
	}
	stage('sending docker file to Ansible over ssh'){
		sshagent(['ansible_demo']){
		    sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private'
		    sh 'scp	/var/lib/jenkins/workspace/pipeline_demo/* ubuntu@ip_ansible_private:/home/ubuntu'
		{
	}
	stage('Docker Build Image'){
		sshagent(['ansible_demo']){
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private cd /home/ubuntu/'
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image build -t $JOB_NAME:v1.$BUILD_ID .'
		}
		
	}
	stage('Docker image tagging'){
		sshagent(['ansible_demo']){
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private cd /home/ubuntu/'
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image tag $JOB_NAME:v1.$BUILD_ID {NameInDockerBub}/$JOB_NAME:v1.$BUILD_ID'
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image tag $JOB_NAME:v1.$BUILD_ID {NameInDockerBub}/$JOB_NAME:latest'
		}
	}
	stage('Push docker images to docker hub'){
		sshagent(['ansible_demo']){
			withCredentials([string(credentialsId: 'dockerhub_passwd',variable:'dockerhub_passwd')]){
				sh "ssh -o StrictHostKeyChecking=no docker login -u {name dockerhub} -p ${dockerhub_passwd}"
				sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image push {NameInDockerBub}/$JOB_NAME:v1.$BUILD_ID'
				sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image push {NameInDockerBub}/$JOB_NAME:latest'
			
			
				sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private docker image rm {NameInDockerBub}/$JOB_NAME:v1.$BUILD_ID'
				
			}
		}
	}
	stage('Copy files from ansible to Kubernetes Server'){
		sshagent(['kubernetes_server']){
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@{ip-webapp{private}}'
			sh 'scp	/var/lib/jenkins/workspace/pipeline_demo/* ubuntu@ip_webapp_private:/home/ubuntu'
		}
	}
}
```
- Use Jenkins syntax
	+ sshagent : SSHAgent
	+ Add Credentials : SSH name with private key
	+ ID :kubernetes_server
	+ user : ubuntu
	+ Copy the key and paste it 
- Then check jenkins similar
```
ssh-copy-id -i root@{ip-webapp-private}
ssh root@{ip-webapp-private}
exit
```
```
ls
rm jenkins.sh
```
- If have issues about permission
	+ Get in Ansible Server
```
sudo chmod 777 /var/run/docker.sock
```
- Apply for Jenkins pipe and chech build
- Then in VSC , use Git
```
git add .
git commit -m "Deployment, Service $ Playbooks added"
git push origin main
```
- Then Add stage 
```
stage('kubernetes Deployment using ansible'){
	sshagent(['ansible_demo']){
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private cd /home/ubuntu/'
			sh 'ssh -o StrictHostKeyChecking=no ubuntu@ip_ansible_private ansible-playbook ansible.yml'
			}
		}
}
```
- Use Jenkins Syntax
- Save - Build and Check

- Install ansible in WebApp Server
```
apt install ansible
```
- In Ansible Server
```
ansible-playbook ansible.yml --check
```
- Build Again
- Check in WebApp Server
```
kubectl get all
minikube start
```
- Build Again
- In WebApp Server
```
kubectl get pods
kubectl get svc
docker image ls
```
- Check with {ip_webapp_public:31200}

- Then change code in Dockerfile and see the different
--> So how to create zip ... 
