import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as bycypt from 'bcrypt';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({
    type: String,
    required: [true, 'Add first_name'],
  })
  first_name: string;

  @Prop({
    type: String,
    required: [true, 'Add last_name'],
  })
  last_name: string;

  @Prop({
    type: Date,
    required: [true, 'Add birth_date'],
  })
  birth_date: Date;

  @Prop({
    type: String,
  })
  avatar: string;

  @Prop({
    type: String,
    required: [true, 'Add service price'],
  })
  service_price: string;

  @Prop({
    type: String,
    required: [true, 'Add phone number'],
  })
  phone_number: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  })
  teacher: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: [true, 'Add email'],
  })
  email: string;

  @Prop({
    type: String,
  })
  password: string;

  @Prop({
    type: [String],
    enum: ['user', 'admin'],
    default: ['user'],
  })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('age').get(function () {
  // Calculate the age based on the birth_date
  const birthDate = this.birth_date;
  if (!birthDate) {
    return null; // Handle cases where birth_date is missing
  }

  // Calculate the age in years
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  // Adjust the age if the birthday has not occurred this year yet
  const birthMonth = birthDate.getMonth();
  const currentMonth = today.getMonth();
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && today.getDate() < birthDate.getDate())
  ) {
    return age - 1;
  }

  return age;
});
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Exclude the password and __v fields
    delete ret.password;
    delete ret.__v;
  },
});

//CREATING INDEXES TO MAKE EMAIL AND USERNAME UNIQUE

UserSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } },
);

//HANDLING DUPLICATE FIELD ERRORS

UserSchema.post(['save', 'updateOne'], function (error, doc, next) {
  if (error.code === 11000) {
    if (error.keyPattern.email) {
      next(new Error('Email address already exists'));
    } else {
      next(error);
    }
  } else {
    next(error);
  }
});

// HASHING PASSWORD OR USING PHONE_NUMBER AS PASSWORD IF NO PASSWORD PROVIDED

UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    // If a password is provided, hash it
    if (this.password) {
      this.password = await bycypt.hash(this.password, 10);
    } else {
      // If no password is provided, use phone_number as password
      this.password = await bycypt.hash(this.phone_number.toString(), 10);
    }
  }
  next();
});
