# Presenting app

This is a template project to bootstrap a serverless web application on AWS. 

TODO : Add tech stack
TODO : Add architecture diagram 
TODO : Add code structure/organisation

## Code Structure

This project has three main components
+ Frontend : React Framework
+ Backend : Python
+ Infrastructure : Serverless framework


### Front End
This project uses React for front-end development. This can be replaced by any other libraries and frameworks of your choice e.g. Angular or Vue

```
cd frontend

# install neccessary javscript packages
npm install 

# start development server on your local machine
npm start
```

### Back End

This project uses serverless framework. For more details, please visit serverless documentation https://serverless.com/

There are many other ways to create and deploy infrastructure on the cloud. For example, AWS Amplify is a simple tool to spin up an end-to-end web application on AWS, but it sacrifices level of customisation and control. 

To deploy the application:

```
# Make sure aws cli is configured (this only has to be done once)
aws configure

# install and deploy backend
serverless plugin install --name serverless-python-requirements
serverless plugin install --name serverless-finch
serverless deploy
```

### CI/CD (Optional)

This project utilises github action feature to perform automatic deployment on the master branch. When your commit is pushed or merged to the master branch, it will trigger an github action to build

To set it up: 

1. Create a new AWS user with appropriate permission on AWS
2. Create new programmatic credential (Access key and Secret key) this will allow github to make changes to your AWS account and deploy your app as per .github/workflows/main.yml
3. Add your credential to your github project secrets as:
   * AWS_DEPLOY_ACCESS_KEY
   * AWS_DEPLOY_SECRET_KEY
4. TODO: more details