const translate = require('@vitalets/google-translate-api');

const text = process.argv[2];
const targetLang = process.argv[3];

translate(text, { to: targetLang }).then(res => {
    console.log(res.text);  // Print translated text
}).catch(err => {
    console.error('Translation error:', err);
    process.exit(1);  // Return error code if translation fails
});
