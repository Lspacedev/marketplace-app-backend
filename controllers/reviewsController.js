import Review from "../models/review.js";

async function getBuyerReviews(req, res) {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;
    const reviews = await Review.find({ reviewer: req.user._id })
      .skip(skip)
      .limit(limit);
    const totalReviews = reviews.length;
    console.log({ reviews });
    res.status(200).json({ reviews, totalReviews, page, limit });
  } catch (error) {
    res.status(500).json({ error: "An error occured while fetching reviews." });
  }
}
async function reviewSeller(req, res) {
  try {
    const { seller, rating, reviewText } = req.body;

    const reviewObj = {
      reviewer: req.user._id,
      seller: seller,
      text: reviewText,
      rating,
    };
    const review = await Review.create(reviewObj);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "An error occured while creating review." });
  }
}

export default {
  getBuyerReviews,
  reviewSeller,
};
