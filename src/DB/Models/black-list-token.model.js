import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema( // schema == t2sema
  {
    tokenId: {
      type: String,
      required: true,
      index: { name: "token_index_unique", unique: true },
    },
    expiresAt: { type: String, required: true },
    userId: { type: String, required: true }, // get owner of the token
  },
  { timestamps: true }
);

const blackListTokenModel =
  mongoose.models.blackListTokens ||
  mongoose.model("blackListTokens", blackListTokenSchema);

export default blackListTokenModel;
