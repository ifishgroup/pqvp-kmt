#!groovy

def version          = "0.0.${env.BUILD_NUMBER}"
def repo             = "ifishgroup/pqvp-kmt"
def nodeVersion      = '9.5.0'

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

            def terraformDir = "deploy/docker-swarm/terraform/aws"
            def tfVars
            def tfplan

            if (isPR()) {
                tfVars = "$terraformDir/config/staging.tfvars"
                tfplan = "staging-${version}.tfplan"

                stage('docker publish') {
                    sh "docker login -u $USERNAME -p $PASSWORD"
                    sh "docker push $repo:$tag"
                }

                stage('plan') {
                    sh "cat $PQVP_KMT_PEM > pem.txt"
                    sh "${terraform()} init -backend-config=$terraformDir/config/staging-state-store.tfvars -backend-config='key=tf/staging/git-${gitCommit()}.tfstate' $terraformDir"
                    sh "${terraform()} plan -var-file=$tfVars -var tag=$tag -var private_key_path=pem.txt -var git_commit=${gitCommit()} -var git_branch=${env.BRANCH_NAME} -var version=${version} -out $tfplan $terraformDir"
                }
                
                try {
                    stage('deploy staging') {
                        sh "${terraform()} apply $tfplan"
                    }

                    stage('UAT') {
                        milestone 1

                        def userInput = ''
                        timeout(time: 10, unit: 'MINUTES') {
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
                    sh "${terraform()} destroy -force -var private_key_path=pem.txt $terraformDir"
                }

                stage('docker tag latest') {
                    sh "docker tag $repo:$tag $repo:latest"
                    sh "docker push $repo:latest"
                }
            } else {
                tfVars = "config/prod.tfvars"
                tfplan = "prod-${version}.tfplan"

                stage('plan') {
                    sh "cat $PQVP_KMT_PEM > $terraformDir/pem.txt"
                    sh "cp docker-compose.yml $terraformDir"
                    sh "${terraform("/usr/src/$terraformDir")} init -backend-config=config/prod-state-store.tfvars -force-copy ."
                    sh "${terraform("/usr/src/$terraformDir")} taint null_resource.deploy_docker_stack"
                    sh "${terraform("/usr/src/$terraformDir")} plan -var-file=$tfVars -var tag=latest -var private_key_path=pem.txt -var git_commit=${gitCommit()} -var git_branch=${env.BRANCH_NAME} -var version=${version} -out $tfplan ."
                }

                stage('deploy to prod') {
                    sh "${terraform("/usr/src/$terraformDir")} apply $tfplan"
                }
            }
        }
    }
}

def terraform(String workDir = '/usr/src/') {
    return "docker run --rm -u \$(id -u):\$(id -g) -v ${env.WORKSPACE}:/usr/src/ -v $HOME/.ssh:/root/.ssh -w $workDir hashicorp/terraform:light"
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