$mavenUrl = "https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
$outputFile = "tools\maven.zip"
$toolsDir = "tools"
$mavenDir = "$toolsDir\apache-maven-3.9.6"

Write-Host "Downloading Maven..."
Invoke-WebRequest -Uri $mavenUrl -OutFile $outputFile

Write-Host "Extracting Maven..."
Expand-Archive -Path $outputFile -DestinationPath $toolsDir -Force

Write-Host "Maven set up at $mavenDir"
