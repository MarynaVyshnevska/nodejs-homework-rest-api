const userSubscriptionEnum = require("../../constans/userSubscriptionEnum");
const uuid = require("uuid").v4;

const User = require("../../models/userModel");
// const sendVerifyEmail = require("../../services/emailServices");
const Email = require("../../services/emailSevrice");

const register = async (req, res, next) => {
  const verificationToken = uuid();
  const newUserData = {
    ...req.body,
    verificationToken: verificationToken,
    subscription: userSubscriptionEnum.STARTER,
  };
  const newUser = await User.create(newUserData);

  /** 1 variant send email */
  // const letter = {
  //   to: newUser.email,
  //   subject: "Підтвердження регістрації на сайті",
  //   html: `<a href='http://localhost:3000/api/users/verify/${verificationToken}' target='_blank'>Натисніть для пітдвердження регістрації'</a>`,
  // };
  // await sendVerifyEmail(letter);
  /** 1 variant send email */

  /** 2 variant send email */
  try {
    await new Email(newUser, `http://localhost:3000/api/users/verify/${newUser.verificationToken}`).sendVerifyEmail2();
  } catch (error) {
    console.log(error, 'Ошибка здесь');
  }

  newUser.password = undefined;
  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: newUser,
      // token,
    },
  });
};

module.exports = register;
