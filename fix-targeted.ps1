# Script de correction ciblée des problèmes d'encodage
$content = Get-Content "docs\seances\6_api_rest.md" -Raw -Encoding UTF8

# Corrections très spécifiques
$replacements = @{
    'securite' = 'sécurité'
    'Theorie' = 'Théorie'
    ' ete ' = ' été '
    'creation' = 'création'
    'simplicite' = 'simplicité'
    'scalabilite' = 'scalabilité'
    'compatibilite' = 'compatibilité'
    'definissent' = 'définissent'
    'conçues pour être veritablement' = 'conçues pour être véritablement'
    'standardisée©e' = 'standardisée'
    'repre©sentations' = 'représentations'
    'traité©' = 'traité'
    're©ponses' = 'réponses'
    'lie©es' = 'liées'
    'e©tat' = 'état'
    'reque©ªte' = 'requête'
    'requeªte' = 'requête' 
    'ne©cessaires' = 'nécessaires'
    'reque©ªtes' = 'requêtes'
    'requeªtes' = 'requêtes'
    'ce´te©' = 'côté'
    'inde©pendante' = 'indépendante'
    'e  chaque' = 'à chaque'
    'ame©liore' = 'améliore'
    'fiabilite©' = 'fiabilité'
    'marque©es' = 'marquées'
    'e©vitant' = 'évitant'
    're©pe©titives' = 'répétitives'
    'contre´ler' = 'contrôler'
    'se©paration' = 'séparation'
    'ge¨re' = 'gère'
    'expe©rience' = 'expérience'
    'donne©es' = 'données'
    'me©tier' = 'métier'
    'e©volution' = 'évolution'
    'portabilite©' = 'portabilité'
    're©utilisation' = 'réutilisation'
    'Syste¨me' = 'Système'
    'compose©e' = 'composée'
    'hie©rarchiques' = 'hiérarchiques'
    'oe¹' = 'où'
    'imme©diatement' = 'immédiatement'
    'e©le©ments' = 'éléments'
    'interme©diaires' = 'intermédiaires'
    'e  la demande' = 'à la demande'
    'e©tendre' = 'étendre'
    'fonctionnalite©s' = 'fonctionnalités'
    'exe©cutable' = 'exécutable'
    'oriente©es' = 'orientées'
    'repre©senter' = 'représenter'
    'exprime©es' = 'exprimées'
    'me©thodes' = 'méthodes'
    'Re©cupe©rer' = 'Récupérer'
}

foreach ($key in $replacements.Keys) {
    $content = $content -replace [regex]::Escape($key), $replacements[$key]
}

Set-Content "docs\seances\6_api_rest.md" -Value $content -Encoding UTF8
Write-Host "Corrections ciblées appliquées avec succès!"