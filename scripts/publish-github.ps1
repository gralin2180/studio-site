# Publish Tilkraft Studios to GitHub and invite a collaborator.
# Prerequisite: gh auth login  (or publish via GitHub Desktop first, then run invite-only)

param(
    [string]$Repo = "tilkraft-studios",
    [string]$InviteEmail = "y.faustina@op.iitg.ac.in",
    [ValidateSet("private", "public")]
    [string]$Visibility = "private"
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not (gh auth status 2>$null)) {
    Write-Host "GitHub CLI is not logged in. Run: gh auth login" -ForegroundColor Yellow
    Write-Host "Or publish from GitHub Desktop, then re-run with -SkipCreate if repo already exists."
    exit 1
}

$owner = (gh api user -q .login)
$full = "$owner/$Repo"

if (-not (git remote get-url origin 2>$null)) {
    if ($Visibility -eq "private") {
        gh repo create $Repo --private --source=. --remote=origin --push
    } else {
        gh repo create $Repo --public --source=. --remote=origin --push
    }
} else {
    git push -u origin master
}

Write-Host "Repository: https://github.com/$full" -ForegroundColor Green

gh api "repos/$full/invitations" -f email=$InviteEmail -f permission=push
Write-Host "Invitation sent to $InviteEmail with write (edit) access — they must accept via email/GitHub." -ForegroundColor Green
