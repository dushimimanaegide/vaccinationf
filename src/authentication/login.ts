import { Request, Response } from "express";
import UserModel from "../models/modelsiginup";
import { passComparer } from "../utils/passencodingAnddecoding";
import { generatingToken } from "../utils/token";


export const login = async (req: Request, res: Response) => {
  try {
    const userEmail = req.body.useremail;
    const userPassword = req.body.userpassword;
    
    const user = await UserModel.findOne({ email: userEmail });
    
    if (user) {

   let userInfos = { email: user.email, _id: user._id };

      let token = generatingToken(userInfos);
      let isValidPass = await passComparer(userPassword, user.password);
      if (isValidPass) {
        return res.status(200).json({
          message: "Login successful",
          token: `${token}`,
          data: user,
        });
      } else {
        return res.status(401).json({
          message: " invalid password",
          data: null,
        });
      }
    } else {
      return res.status(401).json({
        message: `user with${userEmail} not found`,
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Errorcfgf",
      data: null,
      theErrorIs: error,
    });
  }
};
