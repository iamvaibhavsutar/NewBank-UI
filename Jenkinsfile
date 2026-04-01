pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "vaibhav411007/newbank-ui"
        DOCKER_TAG = "latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/iamvaibhavsutar/NewBank-UI.git'
            }
        }

        stage('Build UI') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh "docker push $DOCKER_IMAGE:$DOCKER_TAG"
            }
        }

        stage('Deploy UI') {
            steps {
                sh """
                docker stop newbank-ui || true
                docker rm newbank-ui || true
                docker run -d -p 0:80 --name newbank-ui $DOCKER_IMAGE:$DOCKER_TAG
                """
            }
        }
    }

    post {
        success {
            echo '✅ UI Deployment Successful!'
        }
        failure {
            echo '❌ UI Pipeline Failed!'
        }
    }
}
