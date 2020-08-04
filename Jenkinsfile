@Library('jenkins-shared-library')_
pipeline {
    environment {
        registry = "windsekirun/simple-roulette"
        registryCredential = 'DockerHub'
    }
    agent any
    stages {
        stage ('Start') {
            steps {
                sendNotifications 'STARTED'
            }
        }
        stage('Environment') {
            parallel {
                stage('display') {
                    steps {
                        sh 'ls -la'
                    }
                }
            }
        }
        stage('Build docker image') {
            steps {
                sh 'docker build -t $registry --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` --build-arg VCS_REF=`git rev-parse --short HEAD` --build-arg VERSION=`cat VERSION` .'
            }
        }
        stage('Deploy docker image') {
            steps {
                withDockerRegistry([ credentialsId: registryCredential, url: "" ]) {
                    sh 'docker push $registry'
                }
            }
        }
     }
    post {
        always {
            sendNotifications currentBuild.result
        }
    }
}
