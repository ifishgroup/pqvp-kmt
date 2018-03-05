#!groovy

def version           = "0.0.${env.BUILD_NUMBER}"
def insightRepo       = "ifishgroup/insight"
def insightApiRepo    = "ifishgroup/insight-api"
def insightImportRepo = "ifishgroup/insight-import"

TERRAFORM_DIR        = 'deploy/docker-swarm/terraform/aws'
NOTIFICATIONS        = true

node('docker') {
    stage('checkout') {
        checkout scm
    }

    def tag = "git-${gitCommit()}"

    stage('docker build Insight') {
        sh "docker build -t $insightRepo:$tag ."
    }

    stage('docker build Insight API') {
        sh "docker build -t $insightApiRepo:$tag ./api/"
    }

    stage('docker build Mongo Import') {
        sh "docker build -t $insightImportRepo:$tag ./api/data/"
    }

    if (isMaster() || isPR()) {
        withEnv([
            "COMPOSE_FILE=docker-compose-e2e.yml",
            "TAG=$tag"
        ]) {
            // stage('e2e tests') {
            //     try {
            //         sh "docker-compose run --rm e2e"
            //     } catch(e) {
            //         error "Failed: ${e}"
            //     } finally {
            //         sh "docker-compose down"
            //     }
            // }
        }

        withCredentials([
            usernamePassword(credentialsId: 'docker-hub-id', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME'),
            file(credentialsId: 'pqvp-kmt-pem', variable: 'PQVP_KMT_PEM')
        ]) {

            sh "cp docker-stack.yml $TERRAFORM_DIR"
            sh "cp resources/nginx/nginx.conf $TERRAFORM_DIR"
            sh "cat $PQVP_KMT_PEM > $TERRAFORM_DIR/pem.txt"

            if (isPR()) {
                def tfplan = "staging-${version}.tfplan"

                stage('docker publish') {
                    sh "docker login -u $USERNAME -p $PASSWORD"
                    sh "docker push $insightRepo:$tag"
                    sh "docker push $insightApiRepo:$tag"
                    sh "docker push $insightImportRepo:$tag"
                }

                stage('plan') {
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
                        sh "${terraform(false)} apply $tfplan"
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
                    sh "docker tag $insightRepo:$tag $insightRepo:latest"
                    sh "docker tag $insightApiRepo:$tag $insightApiRepo:latest"
                    sh "docker tag $insightImportRepo:$tag $insightImportRepo:latest"
                    sh "docker push $insightRepo:latest"
                    sh "docker push $insightApiRepo:latest"
                    sh "docker push $insightImportRepo:latest"
                }
            } else {
                def tfplan = "prod-${version}.tfplan"

                try {
                    stage('plan') {
                        sh "${terraform()} init -backend-config=config/prod-state-store.tfvars -force-copy ."
                        taintResources()
                        sh """${terraform()} plan \
                            -var-file=config/prod.tfvars \
                            -var tag=latest \
                            -var private_key_path=pem.txt \
                            -var manager_volume_size=50 \
                            -var worker_volume_size=25 \
                            -var git_commit=${gitCommit()} \
                            -var git_branch=${env.BRANCH_NAME} \
                            -var version=${version} \
                            -out $tfplan \
                            .
                        """
                    }

                    stage('deploy to prod') {
                        sh "${terraform(false)} apply $tfplan"
                        publishProdInfo(getMasterAddress())
                    }
                } catch(e) {
                    error "Failed: ${e}"
                    notifySlack("FAILED")
                } 
            }
        }
    }
}

def publishStagedInfo(String ip) {
    if (NOTIFICATIONS) {
        notifyGithub("${env.JOB_NAME}, build [#${env.BUILD_NUMBER}](${env.BUILD_URL}) - Staged deployment can be viewed at: [http://$ip](http://$ip). Staged builds require UAT, click on Jenkins link when finished with UAT to mark the build as 'pass' or 'failed'")
        slackSend(color: 'good',
            message: "${env.JOB_NAME}, build #${env.BUILD_NUMBER} ${env.BUILD_URL} - Staged deployment can be viewed at: http://$ip. Staged builds require UAT, click on Jenkins link when finished with testing to mark the build as 'pass' or 'failed'")
    }
}

def notifyTeardownEvent(String ip) {
    if (NOTIFICATIONS) {
        notifyGithub("${env.JOB_NAME}, build [#${env.BUILD_NUMBER}](${env.BUILD_URL}) - Staged build @ $ip was removed")
        slackSend(color: 'good',
            message: "${env.JOB_NAME}, build #${env.BUILD_NUMBER} ${env.BUILD_URL} - Staged build @ $ip was removed")
    }
}

def publishProdInfo(String ip) {
    if (NOTIFICATIONS) {
        slackSend(color: 'good',
            message: """
            ${env.JOB_NAME}, build #${env.BUILD_NUMBER} ${env.BUILD_URL} - Deployed to production
            
            Insight: http://insight.ifglabs.com
            Docs: http://insight.docs.ifglabs.com
            Weave Scope: http://insight.ifglabs.com:4041
            Grafana: http://insight.ifglabs.com:3000
            Prometheus: http://insight.ifglabs.com:9090
            Alert Manager: http://insight.ifglabs.com:9093
            Unseen: http://insight.ifglabs.com:9094
            """)
    }
}

def notifyGithub(String comment) {
    if (NOTIFICATIONS) {
        withCredentials([
            string(credentialsId: '96df6ea0-11f0-4868-a203-7dbfac9bef3d', variable: 'TOKEN')
        ]) {
            def pr  = env.BRANCH_NAME.split("-")[1].trim()
            sh "curl -H \"Content-Type: application/json\" -u ifg-bot:$TOKEN -X POST -d '{\"body\": \"$comment\"}' https://api.github.com/repos/ifishgroup/pqvp-kmt/issues/$pr/comments"
        }
    }
}

def notifySlack(String buildStatus) {
    if (NOTIFICATIONS) {
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

def terraform(def asUser = true) {
    def docker = "docker run --rm -v ${env.WORKSPACE}:/usr/src/ -w /usr/src/$TERRAFORM_DIR"
    if (asUser) {
        docker = "$docker -u \$(id -u):\$(id -g)"
    }
    return "$docker hashicorp/terraform:light"
}

def taintResources() {
    try {
        sh "${terraform()} taint null_resource.create_join_scripts"
        sh "${terraform()} taint null_resource.deploy_docker_stack"
        sh "${terraform()} taint null_resource.deploy_monitoring_stack"
    } catch(e) {
        println e
    }
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