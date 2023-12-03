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
        BACKEND_IMG_VERSION="v3"
    }
  
    stages
    {
        stage('clean_workspace_and_checkout_source') {
          steps {
            
              script{
                if (env.ghprbSourceBranch != "test_dev" && env.ghprbTargetBranch == "dev") {
                    echo "Violating pull request rules "  
                    currentBuild.result='ABORTED'
                    STATE='ABORTED'
                    return
                }
                else if (env.ghprbTargetBranch != "dev") {
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
        stage('Build and Test')
        {
             when {
                    expression { STATE != 'ABORTED' }
                 }
            steps
            {
               
                sh '''
                    echo 'Building and Testing...'
                '''
                script {
                    dockerImage=docker.build("$USER_CREDENTIALS_USR/backend:v${CURR_TAG_NUM}")
                }
            }
        }
        // stage('Test')
        // {
        //     when {
        //             expression { STATE != 'ABORTED' }
        //          }
        //     steps
        //     {
             
        //         echo 'Testing...'
        //     }
        // }
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