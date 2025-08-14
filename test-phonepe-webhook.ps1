# URL of your deployed webhook
$webhookUrl = "https://phonepetry-lzg31zyf1-pawans-projects-98a0b874.vercel.app/api/phonepe-webhook"

# Sample payloads
$payloads = @(
    @{ transactionId = "test123"; status = "SUCCESS"; amount = 10000; message = "Payment successful" },
    @{ transactionId = "test124"; status = "FAILED"; amount = 5000; message = "Payment failed" }
)

foreach ($payload in $payloads) {
    $json = $payload | ConvertTo-Json
    Write-Host "Sending payload:" $json

    $response = Invoke-RestMethod -Uri $webhookUrl -Method POST -Body $json -ContentType "application/json"

    Write-Host "Response from webhook:" ($response | ConvertTo-Json)
    Write-Host "---------------------------------------------"
}
