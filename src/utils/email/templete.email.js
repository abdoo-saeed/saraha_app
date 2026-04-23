export const emailTemplate = ({code,title,expiredTime})=>{
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
        
        <table width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4; padding:20px;">
            <tr>
                <td align="center">
                    
                    <table width="500" cellspacing="0" cellpadding="0" style="background:#ffffff; padding:20px; border-radius:10px;">
                        
                        <tr>
                            <td align="center">
                                <h2 style="color:#333;">${title}</h2>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p style="color:#555; font-size:16px; line-height:1.5;">
                                    Use the code below to verify your email:
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding:20px;">
                                <div style="font-size:24px; font-weight:bold; color:#000; background:#eee; padding:10px 20px; display:inline-block; border-radius:5px;">
                                    ${code}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p style="color:#999; font-size:14px;">
                                    This code will expire in ${expiredTime} minutes.
                                </p>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
      `
}