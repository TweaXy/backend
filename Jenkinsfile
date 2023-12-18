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
        BACKEND_IMG_VERSION="v5"
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
                      else if (env.ghprbTargetBranch == "chat_dev") {
                        echo "Another Job Trigger"
                        echo "# builds = ${Jenkins.instance.queue.items.length}" 
                        if (Jenkins.instance.queue.items.length  > 1) {
                        buildBlocker {
                            message('Build blocked temporarily.')
                        }
                    }
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
                        //    sh '''
                    //        docker image prune -f
                      //      '''
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
                sh '''
                   docker run --name db \
                     --rm -e MYSQL_DATABASE=TweeXy-testing \
                    -e MYSQL_ROOT_PASSWORD="1111" \
                    -d mysql:latest
                    sleep 20
                '''
             
                echo 'Preparing for build and testing...'
            }
            post{
                success{
                    sh '''
                     /opt/edit_test_db.sh 
                     cp /opt/.env .
                     cp /opt/test_db.sh .
                     cp /opt/prod_db.sh .
                    '''
                }
              failure {
                    sh '''
                   container_name="db"

                        # Check if the container exists before attempting to stop it
                        if docker ps -a --format '{{.Names}}' | grep -q "^${container_name}\$"; then
                            docker stop "${container_name}"
                            echo "Container '${container_name}' stopped."
                        else
                            echo "Container '${container_name}' not found."
                        fi
                   '''
                }
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
                    dockerImage=docker.build("$USER_CREDENTIALS_USR/backend:${BACKEND_IMG_VERSION}")
                }
            }
             post {
                success {
                   sh '''
                   container_name="db"

                        # Check if the container exists before attempting to stop it
                        if docker ps -a --format '{{.Names}}' | grep -q "^${container_name}\$"; then
                            docker stop "${container_name}"
                            echo "Container '${container_name}' stopped."
                        else
                            echo "Container '${container_name}' not found."
                        fi
                   '''
                }
                failure {
                    sh '''
                   container_name="db"

                        # Check if the container exists before attempting to stop it
                        if docker ps -a --format '{{.Names}}' | grep -q "^${container_name}\$"; then
                            docker stop "${container_name}"
                            echo "Container '${container_name}' stopped."
                        else
                            echo "Container '${container_name}' not found."
                        fi
                   '''
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
