pipeline {
    agent any

    environment {
        IMAGE_NAME = "vaibhav411007/newbank-ui"
        IMAGE_TAG = "${BUILD_NUMBER}"
        IMAGE_FULL = "${IMAGE_NAME}:${IMAGE_TAG}"
    }

    stages {

        stage('Clean Workspace') {
            steps { cleanWs() }
        }

        stage('Checkout UI Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/iamvaibhavsutar/NewBank-UI.git'
            }
        }

        stage('Build UI (Dockerized Node)') {
            steps {
                sh '''
                mkdir -p .npm

                docker run --rm \
                -u $(id -u):$(id -g) \
                -e HOME=/tmp \
                -v $PWD:/app \
                -v $PWD/.npm:/tmp/.npm \
                -w /app \
                node:20 \
                sh -c "npm install --cache /tmp/.npm && npm run build"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build --no-cache -t $IMAGE_FULL .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $IMAGE_FULL
                    '''
                }
            }
        }

        stage('Trigger Deployment') {
            steps {
                build job: 'Newbank_deployment'
            }
        }
    }

    post {
        success { echo "✅ UI Build Success" }
        failure { echo "❌ UI Failed" }
    }
}
