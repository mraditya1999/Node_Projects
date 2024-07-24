import mongoose, { Model } from 'mongoose';
import { IReviewDocument } from '../types/models.types';

export interface IReviewModel extends Model<IReviewDocument> {
  calculateAverageAndRating(productId: mongoose.Types.ObjectId): Promise<void>;
}

const ReviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    rating: {
      type: Number,
      minlength: [1, 'Rating should be between 1 to 5'],
      maxlength: [5, 'Rating should be between 1 to 5'],
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      maxlength: [100, 'Review title cannot be more than 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

// Only 1 review can be provided per product by one user
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageAndRating = async function (
  productId: mongoose.Types.ObjectId
) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    const Product = mongoose.model('Product');
    await Product.findOneAndUpdate(
      { _id: productId },
      {
        averageRating: result[0]?.averageRating || 0,
        numOfReviews: result[0]?.numOfReviews || 0,
      },
      { new: true } // to return the updated document
    );
  } catch (error) {
    console.error('Error updating product average rating', error);
    throw error;
  }
};

ReviewSchema.post('save', async function () {
  const review = this as IReviewDocument;
  await (review.constructor as IReviewModel).calculateAverageAndRating(
    review.product
  );
});

ReviewSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function () {
    const review = this as IReviewDocument;
    await (review.constructor as IReviewModel).calculateAverageAndRating(
      review.product
    );
  }
);

const Review = mongoose.model<IReviewDocument, IReviewModel>(
  'Review',
  ReviewSchema
);
export default Review;
