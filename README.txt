- "sbt run" to start

To deploy
- "sbt dist"
- Start instance with ports open (22, 9000, 4200?)
-  ssh -i ~/.ssh/May2020.pem ubuntu@[ip]
-  sudo apt-get update
-  sudo apt-get install default-jdk
-  sudo apt-get install unzip
-  Install SBT  
     echo "deb https://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list
     curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | sudo apt-key add
     sudo apt-get update
     sudo apt-get install sbt
-  Upload .zip to instance
-  Unzip package
-  Update application.conf to add local host to whitelist
-  bin/scala-play-angular-seed -Dplay.http.secret.key=TheQuickBrownFox
