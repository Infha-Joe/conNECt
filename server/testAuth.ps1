$body = @{
    accountType = "student"
    name = "Real Test"
    email = "realtest@nec.edu.in"
    password = "password123"
    collegeId = "TEST1234"
    year = 2
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
Write-Output $response.Content
