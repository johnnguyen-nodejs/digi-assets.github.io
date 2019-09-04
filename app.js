var express = require('express');
var speakeasy = require('speakeasy');
var QRcode = require('qrcode');

var app = express();

app.get('/',(req,res)=>{
    var secret = speakeasy.generateSecret({length: 30});
    console.log('secret.base32: '+ secret.base32);
    var token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
    });
    console.log('token:'+ token);
    QRcode.toDataURL(secret.otpauth_url,(err, data_url)=>{
        res.end('<!DOCTYPE html>\
            <html lang="en">\
            <head>\
                <meta charset="UTF-8">\
                <meta name="viewport" content="width=device-width, initial-scale=1.0">\
                <meta http-equiv="X-UA-Compatible" content="ie=edge">\
                <title>2FA example</title>\
            </head>\
            <body>\
                <img src="'+data_url+'" alt="Mountain View">\
                <div class="col-lg-2 col-sm-3 col-xs-6"> OTP : '+token+' </div>\
            </body>\
            </html>');
    });
});
app.post('/verify',(req,res)=>{
    var token = req.body.token;
    var tokenValidates = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token: token,
        window: 6
    });
    return tokenValidates;
});
app.listen(8082);
console.log('server running on port 8082');