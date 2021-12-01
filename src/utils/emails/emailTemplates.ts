import { CheckEmail, ResetPassword } from './locales/locale';

export const checkEmail = (
  language: Language,
  verificationLink: string
) => {
  const locale: CheckEmail = require(`./locales/${language}`).checkEmail;

  const html = `<!DOCTYPE html>
  <html style="height: 100%;">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>${locale.subject}</title>
  
  
    <style>img {
      border: none; -ms-interpolation-mode: bicubic; max-width: 100%; margin-top: 1rem;
    }
    body {
      height: 100%;
    }
    body {
      background-color: #1779e5; font-family: Verdana, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
    }
    .ExternalClass {
      width: 100%;
    }
    @media only screen and (max-width: 620px) {
      table.body h1 {
        font-size: 28px !important; margin-bottom: 10px !important;
      }
      table.body p {
        font-size: 16px !important;
      }
      table.body ul {
        font-size: 16px !important;
      }
      table.body ol {
        font-size: 16px !important;
      }
      table.body td {
        font-size: 16px !important;
      }
      table.body span {
        font-size: 16px !important;
      }
      table.body a {
        font-size: 16px !important;
      }
      table.body .wrapper {
        padding: 0 !important;
      }
      table.body .content {
        padding: 0 !important;
      }
      table.body .container {
        padding: 1rem !important; width: 100% !important;
      }
      table.body .main {
        border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;
      }
      table.body .btn table {
        width: 100% !important;
      }
      table.body .btn a {
        width: 100% !important;
      }
    }
    </style>
  </head>
  <body class="" style="mso-line-height-rule: exactly; height: 100%; font-family: Verdana, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; margin: 0; padding: 0; background-color: #1779e5" bgcolor="#1779e5">
  <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">${locale.subject}</span>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%; height: 100%; background-color: #1779e5" bgcolor="#1779e5">
    <tr>
      <td style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important;" valign="middle"> </td>
      <td class="container" style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important; max-width: 580px; width: 580px; margin: 0 auto; padding: 10px;" valign="middle">
        <table class="content" cellpadding="0" cellspacing="0" border="0" style="border-collapse: separate; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%; height: 100%; box-sizing: border-box; max-width: 580px; margin: 0 auto; padding: 10px;">
          <tr><td style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important;" valign="middle">
  
            <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%; height: 100%;">
  
              <tr>
                <td class="wrapper" style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important; box-sizing: border-box; padding: 20px;" valign="middle">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%; height: 100%;">
                    <tr>
                      <td style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important;" valign="middle">
                        <p style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; margin: 0 0 15px;">${locale.thanks}</p>
                        <p style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; margin: 0 0 15px;">${locale.please_verify} <a href="${verificationLink}" target="_blank" style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; text-decoration: underline;">${locale.button}</a>.</p>
                        <p style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; margin: 0 0 15px;">${locale.get_help} <a href="https://twitter.com/hiberfile" style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; text-decoration: underline;">${locale.twitter_account}</a>.</p>
                        <p style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; margin: 0 0 15px;">${locale.salutations}<br>
                          ${locale.hf_team}<br>
                          <a href="https://hiberfile.com/" style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; text-decoration: underline;">https://hiberfile.com/</a></p>
                        <img class="td-last-child" alt="hiberfile logo" src="https://hiberfile.com/logo.png" style="-ms-interpolation-mode: bicubic; max-width: 100%; margin-top: 1rem; margin-bottom: 0; border: none; width: 5rem; height: auto;">
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
  
            </table>
  
          </td></tr>
        </table>
      </td>
      <td style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important;" valign="middle"> </td>
    </tr>
  </table>
  </body>
  </html>
  `

  return { html, subject: locale.subject };
};

export const resetPassword = (
  language: Language,
  resetPasswordLink: string
) => {
  const locale: ResetPassword = require(`./locales/${language}`).resetPassword;

  // const html = `
  // <html lang=${language}>
  //   <head>
  //     <link rel="preconnect" href="https://fonts.googleapis.com">
  //     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  //     <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap" rel="stylesheet">
  //     <title>${locale.subject}</title>
  //
  //     <!--[if (gte mso 9)|(IE)]><!-->
  //     <link rel="preconnect" href="https://fonts.googleapis.com">
  //     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  //     <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap" rel="stylesheet">
  //     <!--<![endif]-->
  //   </head>
  //   <body style="padding: 2rem; color: white; font-family: 'Poppins','Google Sans','Roboto',sans-serif; font-size: 1.1rem; font-weight: 500; background: radial-gradient(100% 197.75% at 0% 0%, #009BF5 0%, #2D56D5 100%);" >
  //     <main style="padding: 16.7vw; height: min-content; min-height: 100%; display: flex; flex-direction: column; justify-content: center;" >
  //       <p style="margin-bottom: 2rem;" >${
  //   locale.you_asked_for_reset
  // } ${locale.if_you_not_asked} ${locale.if_you_asked} <a href="${resetPasswordLink}" style="color: white; text-decoration: underline" >${
  //   locale.button
  // }</a> ${locale.follow_instructions}.</p>
  //       <p style="margin-bottom: 2rem;" >${locale.get_help}</p>
  //       <div style="margin-bottom: 5rem;" >
  //         <p style="margin: 0;" >${locale.salutations}</p>
  //         <p style="margin: 0;" >${locale.hf_team}</p>
  //         <p style="margin: 0;" ><a href="https://hiberfile.com/" style="color: white; text-decoration: underline" >https://hiberfile.com/</a></p>
  //       </div>
  //       <img src="https://hiberfile.com/logo.png" alt="hiberfile logo" style="width: 5rem; height: auto;" />
  //     </main>
  //   </body>
  // </html>`;

  const html = `<!DOCTYPE html>
  <html style="height: 100%;">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>${locale.subject}</title>
  
  
    <style>img {
      border: none; -ms-interpolation-mode: bicubic; max-width: 100%; margin-top: 1rem;
    }
    body {
      height: 100%;
    }
    body {
      background-color: #1779e5; font-family: Verdana, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
    }
    .ExternalClass {
      width: 100%;
    }
    @media only screen and (max-width: 620px) {
      table.body h1 {
        font-size: 28px !important; margin-bottom: 10px !important;
      }
      table.body p {
        font-size: 16px !important;
      }
      table.body ul {
        font-size: 16px !important;
      }
      table.body ol {
        font-size: 16px !important;
      }
      table.body td {
        font-size: 16px !important;
      }
      table.body span {
        font-size: 16px !important;
      }
      table.body a {
        font-size: 16px !important;
      }
      table.body .wrapper {
        padding: 0 !important;
      }
      table.body .content {
        padding: 0 !important;
      }
      table.body .container {
        padding: 1rem !important; width: 100% !important;
      }
      table.body .main {
        border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;
      }
      table.body .btn table {
        width: 100% !important;
      }
      table.body .btn a {
        width: 100% !important;
      }
    }
    </style>
  </head>
  <body class="" style="mso-line-height-rule: exactly; height: 100%; font-family: Verdana, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; margin: 0; padding: 0; background-color: #1779e5" bgcolor="#1779e5">
  <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">${locale.subject}</span>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%; height: 100%; background-color: #1779e5" bgcolor="#1779e5">
    <tr>
      <td style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important;" valign="middle"> </td>
      <td class="container" style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important; max-width: 580px; width: 580px; margin: 0 auto; padding: 10px;" valign="middle">
        <table class="content" cellpadding="0" cellspacing="0" border="0" style="border-collapse: separate; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%; height: 100%; box-sizing: border-box; max-width: 580px; margin: 0 auto; padding: 10px;">
          <tr><td style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important;" valign="middle">
  
            <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%; height: 100%;">
  
              <tr>
                <td class="wrapper" style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important; box-sizing: border-box; padding: 20px;" valign="middle">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%; height: 100%;">
                    <tr>
                      <td style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important;" valign="middle">
                        <p style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; margin: 0 0 15px;">${locale.you_asked_for_reset} ${locale.if_you_not_asked} ${locale.if_you_asked} <a href="${resetPasswordLink}" target="_blank" style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; text-decoration: underline;">${locale.button}</a> ${locale.follow_instructions}</p>
                        <p style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; margin: 0 0 15px;">${locale.get_help} <a href="https://twitter.com/hiberfile" style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; text-decoration: underline;">${locale.twitter_account}</a>.</p>
                        <p style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; margin: 0 0 15px;">${locale.salutations}<br>
                          ${locale.hf_team}<br>
                          <a href="https://hiberfile.com/" style="font-family: Verdana, sans-serif; font-size: 17px; font-weight: normal; color: #ffffff; text-decoration: underline;">https://hiberfile.com/</a></p>
                        <img class="td-last-child" alt="hiberfile logo" src="https://hiberfile.com/logo.png" style="-ms-interpolation-mode: bicubic; max-width: 100%; margin-top: 1rem; margin-bottom: 0; border: none; width: 5rem; height: auto;">
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
  
            </table>
  
          </td></tr>
        </table>
      </td>
      <td style="font-family: Verdana, sans-serif; font-size: 14px; display: table-cell !important;" valign="middle"> </td>
    </tr>
  </table>
  </body>
  </html>
  `

  return { html, subject: locale.subject };
}
