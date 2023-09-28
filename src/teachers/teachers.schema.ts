import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Teacher extends Document {
  @Prop({
    type: String,
    required: [true, 'Add first name'],
  })
  first_name: string;

  @Prop({
    type: String,
    required: [true, 'Add last name'],
  })
  last_name: string;

  @Prop({
    type: Number,
    enum: [1, 2, 3, 4],
    required: [true, 'Add degree'],
  })
  degree: number;

  @Prop({
    type: Number,
    required: [true, 'Add phone number'],
  })
  phone_number: number;

  @Prop({
    type: String,
    required: [true, 'Add avatar'],
  })
  avatar: string;

  @Prop({
    type: String,
    required: [true, 'Add information'],
  })
  information: string;

  @Prop({
    type: String,
    enum: ['man', 'woman'],
  })
  gender: string;

  @Prop({
    type: String,
    enum: ['even', 'odd'],
  })
  work_days: string;

  @Prop({
    type: String,
    required: [true, 'Add email'],
  })
  email: string;

  @Prop({
    type: Date,
    required: [true, 'Add birth date'],
  })
  birth_date: Date;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

//CREATING INDEXES TO MAKE EMAIL  UNIQUE

TeacherSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } },
);

//HANDLING DUPLICATE FIELD ERRORS
TeacherSchema.post(['save', 'updateOne'], function (error, doc, next) {
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
