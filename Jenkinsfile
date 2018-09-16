pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION="us-east-1"
    }

    stages {

        stage ('Dev init')
        {
            steps {
                
                deleteDir()
                
                checkout scm
                
                sh '''
                    nodejs --version
                    npm cache clean --force
                    npm install serverless-offline --save-dev
                    npm install serverless-mocha-plugin --save-dev
                    serverless plugin install -n serverless-dynamodb-local
                    npm install
                '''
            }
        }

        stage ('System Test on Dev') {
             
             steps {
                sh ''' 
                    sls dynamodb remove
                    serverless dynamodb install
                    chmod 755 startOffline.sh
                    chmod 755 stopOffline.sh
                    export TASKS_ENDPOINT=http://localhost:3000
                    serverless invoke test
                '''
                }
        }

        stage ('Deploy to SIT') {

            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'sit-serverless', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh "serverless deploy --stage sit"
                }
            }
        }

        stage ('System Test on SIT') {
             
             steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'sit-serverless', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh ''' 
                       export TASKS_ENDPOINT=https://ax1hlqv0vl.execute-api.us-east-1.amazonaws.com/sit
                       serverless invoke test
                    '''
                }
             }
        }

        stage('Promotion') {
            steps {
                timeout(time: 1, unit:'DAYS') {
                    input 'Deploy to Production?'
                }
            }
        }
        
        stage ('Deploy to PROD') {

            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'prod-serverless', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh "serverless deploy --stage prod"
                }
            }
        }

        stage ('System Test on PROD') {
             
             steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'prod-serverless', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh ''' 
                       export TASKS_ENDPOINT=https://valdnbrq3a.execute-api.us-east-1.amazonaws.com/prod
                       serverless invoke test
                    '''
                }
             }
        }

    }
}
