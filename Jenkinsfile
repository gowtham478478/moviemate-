pipeline {
    agent any

    environment {
        DOCKERHUB_USER    = 'gowthamarasamani'
        BACKEND_IMAGE     = "${DOCKERHUB_USER}/moviemate-backend"
        FRONTEND_IMAGE    = "${DOCKERHUB_USER}/moviemate-frontend"
        DOCKERHUB_CREDS   = credentials('dockerhub-credentials')
        IMAGE_TAG         = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "✅ Checkout complete"
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest ."
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest ."
                }
            }
        }

        stage('Security Scan - Trivy') {
            steps {
                sh """
                    mkdir -p trivy-reports
                    trivy image --severity HIGH,CRITICAL --exit-code 0 --format table --output trivy-reports/backend-report.txt ${BACKEND_IMAGE}:latest || true
                    trivy image --severity HIGH,CRITICAL --exit-code 0 --format table --output trivy-reports/frontend-report.txt ${FRONTEND_IMAGE}:latest || true
                    echo "✅ Trivy scan completed"
                """
            }
            post {
                always {
                    archiveArtifacts artifacts: 'trivy-reports/*.txt', allowEmptyArchive: true
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                sh """
                    echo "${DOCKERHUB_CREDS_PSW}" | docker login -u "${DOCKERHUB_CREDS_USR}" --password-stdin
                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest
                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest
                    docker logout
                """
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check logs above.'
        }
    }
}