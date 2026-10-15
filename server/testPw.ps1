$body = @{
    accountType = "student"
    name = "Infhant Joseph T"
    email = "24205052@nec.edu.in"
    password = "password123"
    role = "student"
    collegeId = "24205052"
    year = "3"
    department = "IT"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
Write-Output $response.Content
