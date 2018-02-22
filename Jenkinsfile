#!groovy

def version          = "0.0.${env.BUILD_NUMBER}"
def repo             = "ifishgroup/pqvp-kmt"
def nodeVersion      = '9.5.0'

TERRAFORM_DIR     = 'deploy/docker-swarm/terraform/aws'

node('docker') {
    stage('checkout') {
        checkout scm
    }

    def tag = "git-${gitCommit()}"

    stage('docker build/unit/lint') {
        sh "docker build -t $repo:$tag ."
    }

    if (isMaster() || isPR()) {
        withEnv([
            "COMPOSE_FILE=docker-compose-e2e.yml",
            "TAG=$tag"
        ]) {
            stage('e2e tests') {
                try {
                    sh "docker-compose build e2e"
                    sh "docker-compose run --rm e2e"
                } catch(e) {
                    error "Failed: ${e}"
                } finally {
                    sh "docker-compose down"
                }
            }
        }

        withCredentials([
            usernamePassword(credentialsId: 'docker-hub-id', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME'),
            file(credentialsId: 'pqvp-kmt-pem', variable: 'PQVP_KMT_PEM')
        ]) {
            if (isPR()) {
                def tfplan = "staging-${version}.tfplan"

                stage('docker publish') {
                    sh "docker login -u $USERNAME -p $PASSWORD"
                    sh "docker push $repo:$tag"
                }

                stage('plan') {
                    sh "cat $PQVP_KMT_PEM > $TERRAFORM_DIR/pem.txt"
                    sh "cp docker-compose.yml $TERRAFORM_DIR"
                    sh """${terraform()} init \
                        -backend-config=config/staging-state-store.tfvars \
                        -backend-config='key=tf/staging/git-${gitCommit()}.tfstate' \
                        .
                    """
                    sh """${terraform()} plan \
                        -var-file=config/staging.tfvars \
                        -var tag=$tag \
                        -var private_key_path=pem.txt \
                        -var git_commit=${gitCommit()} \
                        -var git_branch=${env.BRANCH_NAME} \
                        -var version=${version} \
                        -out $tfplan \
                        .
                    """
                }
                
                def masterAddress = ''
                try {
                    stage('deploy staging') {
                        sh "${terraform()} apply $tfplan"
                        masterAddress = getMasterAddress()
                        publishStagedInfo(masterAddress)
                    }

                    stage('UAT') {
                        milestone 1

                        def userInput = ''
                        timeout(time: 2, unit: 'DAYS') {
                            userInput = input(
                                id: 'userInput',
                                message: "Did staged build 'pass' or 'fail'?",
                                parameters: [choice(name: 'result', choices: 'pass\nfail', description: '')]
                            )
                        }

                        if (userInput != "pass") {
                            error("Staged build failed user acceptance testing")
                        }

                        milestone 2
                    }
                } catch(e) {
                    error "Failed: ${e}"
                } finally {
                    sh "${terraform()} destroy -force -var private_key_path=pem.txt ."
                    notifyTeardownEvent(masterAddress)
                }

                stage('docker tag latest') {
                    sh "docker tag $repo:$tag $repo:latest"
                    sh "docker push $repo:latest"
                }
            } else {
                def tfplan = "prod-${version}.tfplan"

                stage('plan') {
                    sh "cat $PQVP_KMT_PEM > $TERRAFORM_DIR/pem.txt"
                    sh "cp docker-compose.yml $TERRAFORM_DIR"
                    sh "${terraform()} init -backend-config=config/prod-state-store.tfvars -force-copy ."
                    sh "${terraform()} taint null_resource.deploy_docker_stack"
                    sh """${terraform()} plan \
                        -var-file=config/prod.tfvars \
                        -var tag=latest \
                        -var private_key_path=pem.txt \
                        -var git_commit=${gitCommit()} \
                        -var git_branch=${env.BRANCH_NAME} \
                        -var version=${version} \
                        -out $tfplan \
                        .
                    """
                }

                stage('deploy to prod') {
                    sh "${terraform()} apply $tfplan"
                    publishProdInfo(getMasterAddress())
                }
            }
        }
    }
}

def publishStagedInfo(String ip) {
    notifyGithub("${env.JOB_NAME}, build [#${env.BUILD_NUMBER}](${env.BUILD_URL}) - Staged deployment can be viewed at: [http://$ip](http://$ip). Staged builds require UAT, click on Jenkins link when finished with UAT to mark the build as 'pass' or 'failed'")
    slackSend(color: 'good',
        message: "${env.JOB_NAME}, build #${env.BUILD_NUMBER} ${env.BUILD_URL} - Staged deployment can be viewed at: http://$ip. Staged builds require UAT, click on Jenkins link when finished with testing to mark the build as 'pass' or 'failed'")
}

def notifyTeardownEvent(String ip) {
    notifyGithub("${env.JOB_NAME}, build [#${env.BUILD_NUMBER}](${env.BUILD_URL}) - Staged build @ $ip was removed")
    slackSend(color: 'good',
        message: "${env.JOB_NAME}, build #${env.BUILD_NUMBER} ${env.BUILD_URL} - Staged build @ $ip was removed")
}

def publishProdInfo(String ip) {
    notifyGithub("${env.JOB_NAME}, build [#${env.BUILD_NUMBER}](${env.BUILD_URL}) - Deployed to production, can be viewed at: [http://$ip](http://$ip).")
    slackSend(color: 'good',
        message: "${env.JOB_NAME}, build #${env.BUILD_NUMBER} ${env.BUILD_URL} - Deployed to production, can be viewed at: http://$ip.")
}

def notifyGithub(String comment) {
    withCredentials([
        string(credentialsId: '96df6ea0-11f0-4868-a203-7dbfac9bef3d', variable: 'TOKEN')
    ]) {
        def pr  = env.BRANCH_NAME.split("-")[1].trim()
        sh "curl -H \"Content-Type: application/json\" -u ifg-bot:$TOKEN -X POST -d '{\"body\": \"$comment\"}' https://api.github.com/repos/ifishgroup/pqvp-kmt/issues/$pr/comments"
    }
}

def notifySlack(String buildStatus) {
    if (env.BRANCH_NAME =~ /(?i)^pr-/ || env.BRANCH_NAME == "master") {
         echo "currentBuild.result=$buildStatus"

        if (buildStatus != 'SUCCESS' && buildStatus != 'STARTED') {
            buildStatus = 'FAILED'
        }

        def subject = "${buildStatus}: Job '${env.JOB_NAME}, build #${env.BUILD_NUMBER}'"
        def summary = "${subject} (${env.BUILD_URL})"

        if (buildStatus == 'STARTED') {
            color = 'warning'
        } else if (buildStatus == 'SUCCESS') {
            color = 'good'
        } else {
            color = 'danger'
        }

        slackSend(
            color: color,
            message: summary,
            channel: 'pqvp',
            tokenCredentialId: '8bd2373e-a7c8-46aa-bfdc-6cbc44f49578'
        )
    }
}

def terraform() {
    return "docker run --rm -u \$(id -u):\$(id -g) -v ${env.WORKSPACE}:/usr/src/ -w /usr/src/$TERRAFORM_DIR hashicorp/terraform:light"
}

def getMasterAddress() {
    def ip = sh (returnStdout: true, script: "${terraform()} output master_address")
    return ip.trim()
}

def setEnv(String tag) {
    sh "sed -i.bak 's/^TAG=.*/TAG=$tag/' .env"
}

def gitCommit() {
    def commit = sh (returnStdout: true, script: "git rev-parse --short HEAD")
    return commit.trim()
}

def convertBranchName(String name) {
    return name.replaceAll('/', '_')
}

def isMaster() {
    return env.BRANCH_NAME == "master"
}

def isPR() {
    return env.BRANCH_NAME =~ /(?i)^pr-/
}