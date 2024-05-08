import mongoose, { Document, Model, Schema } from "mongoose";

interface UserAttributes {
  username: string;
  email: string;
  password: string;
  address: string;
  telphone: string;
  birthday: string;
  role: string;
  otpExpiresAt: string;
}

interface UserDocument extends Document, UserAttributes {}

const userSchema: Schema<UserDocument> = new mongoose.Schema({
  username: {
    type: String,
    required: true
},

email: {
    type: String,
    required: true
},
address: {
    type: String,
    required: true
},
telphone: {
    type: String,
    required: true
},
birthday: {
    type: String,
    required: true
},

password: {
    type: String,
    required: true
},
role: {
    type: String,
    required: true
},
otpExpiresAt: {
    type: String,
    required: false
},
});

const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User",userSchema);

export default UserModel;
