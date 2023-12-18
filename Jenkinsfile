pipeline
{
    
    agent any
   
    options {
    skipDefaultCheckout true
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '20') // only latest 20 builds are available
    disableConcurrentBuilds() // no multiple builds of the same branch to run concurrently
    }
     environment {
        USER_CREDENTIALS = credentials('registry_cred') 
        STATE='PROCEED'
        CHAT_IMG_VERSION="v1"
    }
  
    stages
    {
        stage('clean_workspace_and_checkout_source') {
          steps {
            
              script{
                if (env.ghprbSourceBranch != "feature/socket" && env.ghprbTargetBranch == "chat_dev") {
                    echo "Violating pull request rules "  
                    currentBuild.result='ABORTED'
                    STATE='ABORTED'
                    return
                }
                else if (env.ghprbTargetBranch != "chat_dev") {
                        echo "Unrelated Pull Request"  
                        STATE='ABORTED'
                        return
                    }
                    else
                    {
                         echo "Cleaning workspace and checking out source"
                         deleteDir()
                         checkout scm
                    }
                }
       
              
            }
        }
            stage('Pre-Build')
        {
            when {
                    expression { STATE != 'ABORTED' }
                 }
            steps
            {
      
                echo 'Preparing for build...'

                sh '''
                  cp /opt/.env .
                  '''  
            }
       
        }
        stage('Build')
        {
             when {
                    expression { STATE != 'ABORTED' }
                 }
            steps
            {
               
                sh '''
                    echo 'Building...'
                '''
                script {
                    dockerImage=docker.build("$USER_CREDENTIALS_USR/chat:${CHAT_IMG_VERSION}")
                }
            }
        }
        stage ('Push') {
             when {
                    expression { STATE != 'ABORTED' }
                 }
            steps {
                sh '''
                    echo 'Pushing...'
                '''
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'registry_cred') {
                        dockerImage.push()
                    }
                }
            }
        }
        stage('Deploy')
        {
             when {
                    expression { STATE != 'ABORTED' }
                 }
            steps
            {
                sh '''
                echo 'Deploying...'
                chmod +x deploy.sh
                ./deploy.sh
                '''
            }
        }
    }
}
