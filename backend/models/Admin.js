// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const adminSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     trim: true,
//   },
//   mobile: {
//     type: String,
//     trim: true,
//     match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number']
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [6, 'Password must be at least 6 characters']
//   },
//   // ✅ Yeh fields missing theen - Add karein
//   otp: {
//     type: String,
//   },
//   otpExpires: {
//     type: Date,
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   role: {
//     type: String,
//     default: 'admin',
//     enum: ['admin']
//   },
//   lastLogin: {
//     type: Date
//   }
// }, {
//   timestamps: true
// });

// // ✅ Hash password before saving
// adminSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // ✅ Compare password method
// adminSchema.methods.comparePassword = async function(password) {
//   return await bcrypt.compare(password, this.password);
// };

// // ✅ Remove sensitive fields from response
// adminSchema.methods.toJSON = function() {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.otp;
//   delete obj.otpExpires;
//   return obj;
// };

// const Admin = mongoose.model('Admin', adminSchema);
// export default Admin;

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      default: 'admin',
      enum: ['admin'],
    },

    lastLogin: {
      type: Date,
    },

    // 🔐 Admin session control
    isLoggedIn: {
      type: Boolean,
      default: false,
    },

    sessionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// 🔑 Compare password
adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔒 Remove sensitive fields from JSON response
adminSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.password;
  delete obj.otp;
  delete obj.otpExpires;
  delete obj.sessionId;

  return obj;
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;