#!/usr/bin/env groovy

@Library("therefore-global-shared-library@master")_

pipeline {

  agent { label 'master' }

  triggers { bitbucketPush() }

  options {

    disableConcurrentBuilds()
    timeout(time: 10, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '7'))

  } // options

  parameters {

    booleanParam(name: 'DEBUG',
                 description: 'If set, it will enable a more verbose output',
                 defaultValue: false)

  } // parameters

  stages {

    stage("Check requirements") {
      when { expression { BRANCH_NAME ==~ /(stage|master)/ } }
      steps {

        // get user that has started the build
        wrap([$class: 'BuildUser']) {
          script {
            if (env.BUILD_USER_ID) {
              env.USER_ID = env.BUILD_USER_ID
            } // if

            else {
              env.USER_ID = "Webhook"
            } // else

          } // script
        } // wrap

        // now, check the requirements
        script {
          // binaries - host machine
          echo "Checking binaries"
          sh """
            ssh -V
          """
          // show environment variables if DEBUG is set
          if ( params.DEBUG == true ) {
            sh """
              whoami
              printenv
            """
          }// if
        } // script
      } // steps
    } // stage

    stage("Deploy Alpha - STG") {
      when { branch 'stage' }
      steps {
        echo "Deploying code to STG"
        script {
          sshagent (credentials: ['jenkins-master-key']) {
            sh """
              ssh -t \
                  -t \
                  -o StrictHostKeyChecking=no \
                  ubuntu@www.alpha.grantconnect.ca \
                  'set -x; cd /var/icgc/stage/react; git pull;'
            """
          } // sshagent
        } // script
      } // steps
    } // stage

    stage("Deploy Beta - PROD") {
      when { branch 'master' }
      steps {
        echo "Deploying code to PROD"
        script {
          sshagent (credentials: ['jenkins-master-key']) {
            sh """
              ssh -t \
                  -t \
                  -o StrictHostKeyChecking=no \
                  ubuntu@www.beta.grantconnect.ca \
                  'set -x; cd /var/icgc/prod/react; git pull;'
            """
          } // sshagent
        } // script
      } // steps
    } // stage

  } // stages

  post {
    always {
      script {
        if (env.BRANCH_NAME != "dev") {
          // kill ssh-agent session if it is running
          sh "ssh-agent -k || true"
        } // if
      } // script
    } // always
  } // post
} // pipeline
