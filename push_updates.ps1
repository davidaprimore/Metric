
# Push Updates Script
# Automatically commits and pushes changes with a sequential commit message (01, 02, etc).

$ErrorActionPreference = "Stop"

# 1. Initialize Git if needed
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..."
    git init
    git branch -M main
    git remote add origin https://davidaprimore@github.com/davidaprimore/Metric.git
}

# 2. Get the last commit message to determine the next sequence number
$lastCommit = try { git log -1 --pretty=%B } catch { "" }

$nextNum = 1
# Use Regex directly to avoid $matches common pitfalls
$match = [regex]::Match($lastCommit, "\d+")
if ($match.Success) {
    $nextNum = [int]$match.Value + 1
}

$seqString = "{0:D2}" -f $nextNum
$commitMessage = "$seqString"

Write-Host "Preparing commit: $commitMessage"

# 3. Add all changes
git add .

# 4. Commit
try {
    git commit -m "$commitMessage"
    Write-Host "Committed successfully: $commitMessage"
}
catch {
    Write-Host "Nothing to commit or commit failed."
}

# 5. Push
Write-Host "Pushing to remote..."
try {
    git push -u origin main
    Write-Host "Done! Update $seqString pushed."
}
catch {
    Write-Host "Push failed. Check credentials or network."
}
