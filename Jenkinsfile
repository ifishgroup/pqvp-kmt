#!groovy

def version  = "0.0.${env.BUILD_NUMBER}"
def image    = "ifishgroup/pqvp-kmt"

try {
    node('master') {
        stage('checkout') {
            checkout scm
        }

        stage('docker test/build') {
            sh "docker build -t $image:$version ."
        }
    }
} catch (Exception e) {
    error "Failed: ${e}"
    currentBuild.result = "FAILED"
} finally {
}
