
# Part 1
## 1. AWS Codecommit 
- Create repository : demo-app 
- IAM
  + Add user
  + enable console access
    > Then generate credentials
- Clone URL : in terminal VScode ( and add username and password )
- Add permission : AWSCodecommitPowerUser
- Test commit code , and change branch
```
git add .
git commit -m ""
git push origin master
```
- And then change code and push with branch dev
```
git checkout -b dev
# change code , and remember save
git add .
git commit -m ""
git push origin dev
# if dev >> then we need merge
```
- Create Pull Request in Codecommit
  + overview
  + Then Merge the code

## 2. Create builds on AWS CodeBuild
- Name : demo-app-build-test
- Source : Choose : AWS Codecommit
- Repository
- Branch : master
- Managed image
- OS : ubuntu
- Standard
- Create a new service role
- Choose Buildspec.yml
  + [Link tutorial buildspec.yml](https://docs.aws.amazon.com/codebuild/latest/userguide/getting-started-cli-create-build-spec.html)
- no Cloudwatch

## 3. Artifacts in AWS 
Artifacts are the output or result of the build process and typically represent the compiled or packaged version of your application or software.
- Choose S3
- Create S3 bucket
- create folder in s3 bucket
- Copy path on Path in Artifacts + artifacts.zip
- Then we start build , we will have artifact.zip
- + Well can edit again artifcts
    
# Part 2 Hands-on Tutorial
## 1. Create Application in CodeDeploy
- Create Application
- Choose compute platform : EC2/On premises

## 2. Create Deployment Group
- Sevice Role {Create new Role}
  + AmazonEC2FullAccess
  + AmazonEC2RoleforAWSCodeDeploy
  + AmazonS3FullAccess
  + AWSCodeDeployFullAccess
  + AWSCodeDeployRole
  + AmazonEC2RoleforAWSCodeDeployLimit...
- Enviroment : Amazon EC2 instances
  + Key   : Name
  + Value : {Create a new EC2 instances, remember create key-value} 
- Install AWS CodeDeploy Agent : Never
- No enable Balance
## 3. Setting up Agent for CodeDeploy
[Link tutorial](https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install-ubuntu.html)
Create a shell script {install.sh} with the below contents and run it
```
#!/bin/bash 
# This installs the CodeDeploy agent and its prerequisites on Ubuntu 22.04.  
sudo apt-get update 
sudo apt-get install ruby-full ruby-webrick wget -y 
cd /tmp 
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/releases/codedeploy-agent_1.3.2-1902_all.deb 
mkdir codedeploy-agent_1.3.2-1902_ubuntu22 
dpkg-deb -R codedeploy-agent_1.3.2-1902_all.deb codedeploy-agent_1.3.2-1902_ubuntu22 
sed 's/Depends:.*/Depends:ruby3.0/' -i ./codedeploy-agent_1.3.2-1902_ubuntu22/DEBIAN/control 
dpkg-deb -b codedeploy-agent_1.3.2-1902_ubuntu22/ 
sudo dpkg -i codedeploy-agent_1.3.2-1902_ubuntu22.deb 
systemctl list-units --type=service | grep codedeploy 
sudo service codedeploy-agent status
```
Then
```
bash install.sh
```
## 4. Create code for web , buildspec.yml and deployspec.yml
- [Link tutorial deployspec.yml](https://docs.aws.amazon.com/codedeploy/latest/userguide/tutorials-wordpress-configure-content.html)
- git clone from codecommit
- Then
```
git add .
git commit -m ""
```
- Then build in codebuild

## 5. Create deployment with code in S3
- {Remember add code in S3}
- Add path of demo_app.zip
- Permisions policies
  + AmazonEC2FullAccess
  + AmazonS3FullAccess
  + AmazonCodeDeployFullAccess
- Modify IAM role on EC2 with this role

## 6. Create Pipeline
- Name
- New service role
- Source : CodeCommit
  + Repository name : demo-app
  + Branch name : master
  + Change detection : AWS Codepipeline
- Builder provider :
- Deploy : AWS Codedeploy
- Overview
Test by
```
git add .
git commit -m "test"
git push origin master
```
* Note LF and CRLF above terminal
* Artifact.zip must have appspec.yml , and buildspec.yml in root folder ( on lap and on aws )
