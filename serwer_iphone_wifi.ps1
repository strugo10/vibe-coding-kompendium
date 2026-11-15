# Lokalny serwer HTTP Wi-Fi dla iPhone (bez konieczności instalowania Python/Node i bez uprawnień Admina)
$ErrorActionPreference = "Continue"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8085

# Wykryj lokalny adres IPv4 w sieci domowej Wi-Fi / LAN
$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" -and $_.PrefixOrigin -ne "WellKnown"
} | Select-Object -First 1 -ExpandProperty IPAddress)

if (-not $localIp) { $localIp = "127.0.0.1" }

$iphoneUrl = "http://${localIp}:${port}/index.html"
$focusUrl  = "http://${localIp}:${port}/day_focus.html"

# Zapisz plik z klikalnym linkiem na Dysku Google, aby na iPhone można było w niego stuknąć
$linkTxtPath = Join-Path $rootDir "OTWORZ_NA_IPHONE_LINK_WIFI.txt"
$linkTxtContent = @"
KOMPENDIUM VIBE CODINGU - LINK DLA TWOJEGO IPHONE (W DOMOWEJ SIECI WI-FI)
=========================================================================

Upewnij się, że komputer oraz iPhone są połączone z tą samą siecią Wi-Fi,
a następnie stuknij poniższy link lub wklej go w przeglądarce Safari na iPhone:

Pełne Kompendium:
$iphoneUrl

Tryb Skupienia (tylko zadania dnia):
$focusUrl
"@
[System.IO.File]::WriteAllText($linkTxtPath, $linkTxtContent, [System.Text.UTF8Encoding]::new($false))

try { Set-Clipboard -Value $iphoneUrl } catch {}
[System.Console]::Beep(660, 100)
[System.Console]::Beep(880, 140)

Clear-Host
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  SERWER KOMPENDIUM DLA IPHONE (WI-FI) JEST AKTYWNY!" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Adres do wpisania w Safari na iPhone (skopiowano też do schowka):" -ForegroundColor Yellow
Write-Host "  $iphoneUrl" -ForegroundColor White
Write-Host ""
Write-Host "Zapisano również plik OTWORZ_NA_IPHONE_LINK_WIFI.txt w folderze na Dysku Google." -ForegroundColor Gray
Write-Host "UWAGA: Jeśli Windows zapyta o Zaporę (Firewall), kliknij 'Zezwól na dostęp'." -ForegroundColor Magenta
Write-Host "Aby zatrzymać serwer, zamknij to okno lub naciśnij Ctrl+C." -ForegroundColor Gray
Write-Host "==================================================================" -ForegroundColor Cyan

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
$listener.Start()

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".txt"  = "text/plain; charset=utf-8"
    ".md"   = "text/plain; charset=utf-8"
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
            $requestLine = $reader.ReadLine()
            while ($reader.Peek() -ge 0) {
                $hLine = $reader.ReadLine()
                if ([string]::IsNullOrEmpty($hLine)) { break }
            }

            if ($requestLine -match '^GET\s+([^\s]+)\s+HTTP') {
                $rawUrl = $matches[1]
                $cleanPath = ($rawUrl -split '\?')[0]
                $cleanPath = [System.Uri]::UnescapeDataString($cleanPath).TrimStart('/')
                if ([string]::IsNullOrWhiteSpace($cleanPath)) { $cleanPath = "index.html" }

                $safeName = [System.IO.Path]::GetFileName($cleanPath)
                $filePath = Join-Path $rootDir $safeName

                if (Test-Path -LiteralPath $filePath -PathType Leaf) {
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
                    $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                    $bodyBytes = [System.IO.File]::ReadAllBytes($filePath)
                    $headerStr = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bodyBytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headerStr)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bodyBytes, 0, $bodyBytes.Length)
                    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 200 OK -> $safeName" -ForegroundColor DarkGreen
                } else {
                    $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Nie znaleziono pliku: $safeName")
                    $headerStr = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($notFound.Length)`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headerStr)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($notFound, 0, $notFound.Length)
                }
            }
            $stream.Flush()
        } catch {
        } finally {
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}
