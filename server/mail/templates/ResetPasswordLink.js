exports.ResetPasswordLink = (token) => {
	return `<!DOCTYPE html>
    <html>
    <head>
        <title>Welcome</title>
    </head>
    <body>
        <p>Dear User,</p>
        <p>Welcome to our service! Please click the link below to verify your email address:</p>
        <p><a href="https://study-notion-frontend-virid.vercel.app/update-password/${token}">Verify your email</a></p>
        <p>Thank you!</p>
        <p>Best regards,<br>Customer Support Team</p>
    </body>
    </html>`
}