import { locale } from './locales/locale';

export const generateEmail = (
  language: 'de' | 'en' | 'es' | 'fr' | 'it' | 'pt',
  verificationLink: string
) => {
  const locale: locale = require(`./locales/${language}`).default;

  const html = `
  <html lang=${language}>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap" rel="stylesheet">
      <title>${locale.subject}</title>

      <!--[if (gte mso 9)|(IE)]><!-->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap" rel="stylesheet">
      <!--<![endif]-->
    </head>
    <body style="padding: 2rem; color: white; font-family: 'Poppins','Google Sans','Roboto',sans-serif; font-size: 1.1rem; font-weight: 500; background: radial-gradient(100% 197.75% at 0% 0%, #009BF5 0%, #2D56D5 100%);" >
      <main style="padding: 16.7vw; height: min-content; min-height: 100%; display: flex; flex-direction: column; justify-content: center;" >
        <p style="margin-bottom: 2rem;" >${locale.thanks}</p>
        <p style="margin-bottom: 2rem;" >${
          locale.please_verify
        } <a href="${verificationLink}" style="color: white; text-decoration: underline" >${
    locale.button
  }</a>.</p>
        <p style="margin-bottom: 2rem;" >${locale.get_help}</p>
        <div style="margin-bottom: 5rem;" >
          <p style="margin: 0;" >${locale.salutations}</p>
          <p style="margin: 0;" >${locale.hf_team}</p>
          <p style="margin: 0;" ><a href="https://hiberfile.com/" style="color: white; text-decoration: underline" >https://hiberfile.com/</a></p>
        </div>
        <img src="https://hiberfile.com/logo.png" alt="hiberfile logo" style="width: 5rem; height: auto;" />
      </main>
    </body>
  </html>`;

  // TODO: use "https://.../logo.svg" instead of "data:image/svg" because Gmail only shows image from secure source

  return { html, subject: locale.subject };
};
