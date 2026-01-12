
# Push Updates Script
# Automatically commits and pushes changes with a sequential commit message.

$ErrorActionPreference = "Stop"

# 1. Initialize Git if needed
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..."
    git init
    git branch -M main
    git remote add origin https://github.com/davidaprimore/Metric.git
}

# 2. Get the last commit message to determine the next sequence number
$lastCommit = try { git log -1 --pretty=%B } catch { "" }

$nextNum = 1
if ($lastCommit -match "Implementação (\d+)") {
    $nextNum = [int]$matches[1] + 1
}

$seqString = "{0:D2}" -f $nextNum
$commitMessage = "Implementação $seqString - Atualização do sistema $(Get-Date -Format 'dd/MM/yyyy HH:mm')"

Write-Host "Preparing commit: $commitMessage"

# 3. Add all changes
git add .

# 4. Commit
try {
    git commit -m "$commitMessage"
    Write-Host "Committed successfully."
} catch {
    Write-Host "Nothing to commit?"
}

# 5. Push
Write-Host "Pushing to remote..."
git push -u origin main

Write-Host "Done! Update $seqString pushed."
