import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
    },
  },
})
export class Product extends Document {
  @Prop({
    type: String,
    required: [true, 'Add name'],
  })
  name: string;

  @Prop({
    type: Number,
    required: [true, 'Add price name'],
  })
  price: number;

  @Prop({
    type: String,
    required: [true, 'Add brand'],
  })
  brand: number;

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
  })
  category: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: [true, 'Add type'],
    enum: ['equipment', 'product'],
  })
  type: string;

  @Prop({
    type: Number,
    required: [true, 'Add count'],
    min: 0,
  })
  count: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

@Schema({
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
    },
  },
})
export class ProductCategory extends Document {
  @Prop({
    type: String,
    required: [true, 'Add category name'],
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Add type'],
    enum: ['equipment', 'product'],
  })
  type: string;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);

ProductCategorySchema.index({ name: 1, type: 1 }, { unique: true });

ProductCategorySchema.post(['save', 'updateOne'], function (error, doc, next) {
  if (error.code === 11000) {
    if (error.keyPattern.name) {
      next(new Error('name already exists'));
    } else {
      next(error);
    }
  } else {
    next(error);
  }
});
