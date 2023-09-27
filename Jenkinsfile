#!/usr/bin/env groovy

node {
    properties([disableConcurrentBuilds()])

    try {

        project = "quan-ly-chi-phi-frontend"
        dockerRepo = "dockerhub-viettelpost.wiinvent.tv"
        imagePrefix = "vtpost-qlcp"
        dockerFile = "Dockerfile"
        imageName = "${dockerRepo}/${imagePrefix}/${project}"
        buildNumber = "${env.BUILD_NUMBER}"
        IMAGE_BUILD = "${imageName}:${env.BRANCH_NAME}-build-${buildNumber}"
        k8sCluster = "local"
        k8sNameSpace = "vtpost-qlcp"
        k8sEnv = "production"

        stage('checkout code') {
            checkout scm
            sh "git checkout ${env.BRANCH_NAME} && git reset --hard origin/${env.BRANCH_NAME}"
        }

        stage('build') {
            sh """
                egrep -q '^FROM .* AS builder\$' ${dockerFile} \
                && docker build -t ${imageName}-stage-builder --target builder -f ${dockerFile} .
                cp .env.${env.BRANCH_NAME} .env
                docker build -t ${imageName}:${env.BRANCH_NAME} -f ${dockerFile} .
            """
        }
        stage('push') {
            sh """
                docker push ${imageName}:${env.BRANCH_NAME}
                docker tag ${imageName}:${env.BRANCH_NAME} ${imageName}:${env.BRANCH_NAME}-build-${buildNumber}
                docker push ${imageName}:${env.BRANCH_NAME}-build-${buildNumber}
            """
        }
        switch (env.BRANCH_NAME) {
            case 'dev':
                stage('deploy-dev') {
                    sh """
                    ## Deploy cluster LongVan
                    /usr/local/k8s/bin/k8sctl --cluster-name=${k8sCluster} --namespace=${k8sNameSpace} --environment=${k8sEnv} --service-name=${project} --image-name=${IMAGE_BUILD}
                  """
                }
                break
            case 'uat':
                k8sNameSpace = "quanlychiphi"
                k8sEnv = "staging"
                stage('deploy-prod') {
                    sh """
                    ## Deploy cluster ViettelPost UAT
                    /usr/local/k8s/bin/k8sctl --cluster-name=${k8sCluster} --namespace=${k8sNameSpace} --environment=${k8sEnv} --service-name=${project} --image-name=${IMAGE_BUILD}
                  """
                }
                break
        }

    } catch (e) {
        currentBuild.result = "FAILED"
        throw e
    }
}
