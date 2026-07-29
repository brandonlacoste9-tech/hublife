# North Network deep-link smoke test
$ErrorActionPreference = "Continue"
$pairs = @(
  @{ name = "hublife";  url = "https://hublife.ca" },
  @{ name = "wacke";    url = "https://wacke.live";    intent = "watch" },
  @{ name = "zyeute";   url = "https://zyeute.com";    intent = "create" },
  @{ name = "grok";     url = "https://grok-assistant.com"; intent = "brief" },
  @{ name = "floguru";  url = "https://floguru.com";   intent = "plan" },
  @{ name = "hellyeah"; url = "https://www.hellyeah-games.com"; intent = "play" },
  @{ name = "chatsnap"; url = "https://chatsnap-app.netlify.app"; intent = "snap" }
)

Write-Host "=== North Network smoke $(Get-Date -Format o) ===" -ForegroundColor Cyan

try {
  Resolve-DnsName hublife.ca -ErrorAction Stop |
    Select-Object -First 3 Name, Type, IPAddress |
    Format-Table -AutoSize
} catch {
  Write-Host "DNS FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

$fail = 0
foreach ($p in $pairs) {
  $target = $p.url
  if ($p.intent) {
    $sep = if ($target.Contains("?")) { "&" } else { "?" }
    $target = "${target}${sep}from=network&via=hublife&intent=$($p.intent)&utm_source=north_network&utm_medium=cross_app&utm_campaign=hublife_smoke"
  }
  try {
    $r = Invoke-WebRequest -Uri $target -UseBasicParsing -TimeoutSec 15 -MaximumRedirection 5
    Write-Host ("OK  {0,-10} {1} -> {2}" -f $p.name, $r.StatusCode, $r.BaseResponse.ResponseUri)
  } catch {
    $fail++
    Write-Host ("BAD {0,-10} {1}" -f $p.name, $_.Exception.Message) -ForegroundColor Red
  }
}

if ($fail -gt 0) {
  Write-Host "FAILED: $fail" -ForegroundColor Red
  exit 1
}
Write-Host "All good." -ForegroundColor Green
