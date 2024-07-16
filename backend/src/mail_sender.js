require('dotenv').config()
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const User =  require("./models/user")
const mongoose = require('mongoose');

async function mailSenderToAll(product) {
	try {    
	  let config = {
		service: 'gmail',
		auth: {
		  user: process.env.EMAIL,
		  pass: process.env.PASSWD 
		}
	  };
	  
	  let transporter = nodemailer.createTransport(config);
	  let mailGenerator = new Mailgen({
		theme: "default",
		product: {
		  name: "Mailgen",
		  link: 'https://mailgen.js/'
		}
	  });
	  
	  const users = await User.find({});
	  console.log(users);

	  const productImgHtml = (product.images && product.images.length > 0) ? `<br><img src="${product.images[0]}" alt="${product.title}">` : '' 
	  console.log(productImgHtml)
	  for (let user of users) {
		let response = {
		  body: {
			name: `${user.firstname} ${user.lastname}`,
			intro: `We have a special offer for you on ${product.title}!`,
			table: {
			  data: [
				{
					item: product.title,
					description: product.description,
					price: product.price,
					discount: `${product.discountPercentage} %`
				}
			  ]
			},
			outro: `Looking forward to doing more business with you. ${productImgHtml}`,
		  }
		};
	
		let mail = mailGenerator.generate(response);
	
		let message = {
		  from: process.env.EMAIL,
		  to: user.email,
		  subject: "SPECIAL OFFER",
		  html: mail
		};
	
		const res = await transporter.sendMail(message);
		console.log(`Email sent to ${user.email}: ` + res.response);

		//i break at firt user because i dont want to have spam on my email
		break;
	  }
	  
	} catch (err) {
	  console.log("Error performing email send: ", err.message);
	}
  }

module.exports = mailSenderToAll