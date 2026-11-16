# Skrypt budujący jednoplikową wersję mobilną dla iPhone oraz skrypt Google Apps Script (.gs)
$ErrorActionPreference = "Stop"
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path

$indexHtml = Get-Content -Path (Join-Path $dir "index.html") -Raw -Encoding UTF8
$tasksJs   = Get-Content -Path (Join-Path $dir "tasks_data.js") -Raw -Encoding UTF8
$appJs     = Get-Content -Path (Join-Path $dir "app.js") -Raw -Encoding UTF8
$qrcodeJs  = Get-Content -Path (Join-Path $dir "qrcode.min.js") -Raw -Encoding UTF8

# Bezpieczna ucieczka dla tagów script wewnątrz stringów JS w plikach
$safeTasksJs  = $tasksJs -replace '</script>', '<\/script>'
$safeAppJs    = $appJs -replace '</script>', '<\/script>'
$safeQrcodeJs = $qrcodeJs -replace '</script>', '<\/script>'

# Zastąpienie zewnętrznego skryptu qrcode.min.js wersją wstrzykniętą inline
$indexHtml = $indexHtml -replace '<script src="qrcode\.min\.js"></script>', "<script>`n$safeQrcodeJs`n</script>"

# Wstrzyknięcie skryptów bezpośrednio do jednego pliku HTML (bez zewnętrznych zależności lokalnych)
$inlineScripts = @"
  <script>
    window.IS_SINGLE_FILE_BUNDLE = true;
  </script>
  <script>
$safeTasksJs
  </script>
  <script>
$safeAppJs
  </script>
"@

$targetPattern = '<script src="tasks_data.js"></script>\s*<script src="app.js"></script>'
$singleFileHtml = [regex]::Replace($indexHtml, $targetPattern, { param($m) $inlineScripts })

$outHtmlPath = Join-Path $dir "Kompendium_iPhone_WszystkoWJednym.html"
[System.IO.File]::WriteAllText($outHtmlPath, $singleFileHtml, [System.Text.UTF8Encoding]::new($false))

# Wygenerowanie gotowego pliku Kod_Chmura_Google_iPhone.gs dla Google Apps Script (script.google.com)
$base64Html = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($singleFileHtml))

$gsContent = @"
/**
 * AKADEMIA VIBE CODINGU - WERSJA WEBOWA DLA IPHONE (SAFARI / VOICEOVER)
 * Instrukcja wdrożenia (zajmuje 1 minutę, działa 24/7 za darmo z dowolnego miejsca):
 * 1. Wejdź na https://script.google.com i kliknij "Nowy projekt".
 * 2. Usuń domyślny kod i wklej całą zawartość tego pliku (Ctrl+V).
 * 3. Kliknij u góry "Wdróż" -> "Nowe wdrożenie".
 * 4. Wybierz typ (ikona koła zębatego): "Aplikacja internetowa".
 * 5. Kto ma dostęp: "Każdy" (lub "Tylko ja", jeśli jesteś zalogowany w Safari na iPhone).
 * 6. Kliknij "Wdróż", skopiuj wygenerowany adres URL i otwórz go w Safari na iPhone!
 */
function doGet() {
  var b64 = "$base64Html";
  var decodedBytes = Utilities.base64Decode(b64);
  var htmlString = Utilities.newBlob(decodedBytes).getDataAsString("UTF-8");
  return HtmlService.createHtmlOutput(htmlString)
    .setTitle("Vibe Coding Academy (iPhone)")
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0, viewport-fit=cover")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
"@

$outGsPath = Join-Path $dir "Kod_Chmura_Google_iPhone.gs"
[System.IO.File]::WriteAllText($outGsPath, $gsContent, [System.Text.UTF8Encoding]::new($false))

Write-Host "Zbudowano pomyslnie:" -ForegroundColor Green
Write-Host "1) $outHtmlPath"
Write-Host "2) $outGsPath"
