const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    console.log("Email constructor called");

    this.to = user.email || user.contact.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.password = user.password;
    this.from = `KiranaWala Support <${process.env.EMAIL_USER}>`;
  }

  // Create different transports for different environments
  newTransport() {
    // if (process.env.NODE_ENV === "production") {
    //   // Sendgrid for production
    //   return nodemailer.createTransport({
    //     service: "SendGrid",
    //     auth: {
    //       user: process.env.SENDGRID_USERNAME,
    //       pass: process.env.SENDGRID_PASSWORD,
    //     },
    //   });
    // }

    // Mailtrap for development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3) Create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to KiranaWala!");
  }
  async welcomeEmployee()
  {
    await this.send("welcomeEmployee","welcome to the backbone of kiranawalla!")
  }
  async welcomeOwner()
  {
    await this.send("welcomeonwer","welcome to the backbone of kiranawalla!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
