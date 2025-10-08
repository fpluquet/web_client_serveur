# Script pour corriger l'encodage
$content = Get-Content "docs\seances\6_api_rest.md.backup" -Raw -Encoding UTF8

# Corrections principales
$content = $content -replace "sÃ©curitÃ©", "sécurité"
$content = $content -replace "ThÃ©orie", "Théorie"
$content = $content -replace "Ã©tÃ©", "été"
$content = $content -replace "crÃ©ation", "création"
$content = $content -replace "simplicitÃ©", "simplicité"
$content = $content -replace "scalabilitÃ©", "scalabilité"
$content = $content -replace "compatibilitÃ©", "compatibilité"

Set-Content "docs\seances\6_api_rest.md" -Value $content -Encoding UTF8
Write-Host "Correction basique terminée"