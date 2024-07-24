import mongoose from 'mongoose';
import { IProductDocument, IReviewDocument } from '../types/models.types';

const ProductSchema = new mongoose.Schema<IProductDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide product name'],
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.png',
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      // enum: ['office', 'kitchen', 'bedroom'],
      enum: {
        values: ['office', 'kitchen', 'bedroom'],
        message: '${VALUE} category is not supported',
      },
    },
    company: {
      type: String,
      required: [true, 'please provide product company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '${VALUE} company is not supported',
      },
    },
    colors: {
      type: [String],
      required: [true, 'please provide product color'],
      default: ['#222'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be between 0 and 5'],
      max: [5, 'Rating must be between 0 and 5'],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } } // virtual
);

// virtuals setup
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
  // match:{rating:5} // return only reviews where rating is 5
});

// Pre middleware to delete related reviews when a product is deleted
ProductSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    const productId = this._id as mongoose.Types.ObjectId;
    await mongoose
      .model<IReviewDocument>('Review')
      .deleteMany({ product: productId });
    next();
  }
);

const Product = mongoose.model<IProductDocument>('Product', ProductSchema);
export default Product;
