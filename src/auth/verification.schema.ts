// order.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
    },
  },
})
export class Verification extends Document {
  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  code: string;

  @Prop({
    type: Date,
    required: true,
  })
  expire_time: Date;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
