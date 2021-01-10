param([string]$url,[string]$pathSave)
$answer = Invoke-RestMethod -Method Get -Uri $url  -ContentType 'application/json' -OutFile $pathSave
return $answer