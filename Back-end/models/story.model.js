import mongoose from "mongoose";
const Schema = mongoose.Schema;

const storySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  media: [
    {
      heading: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      likes: {
        type: Number,
        default: 0,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, 
});


export const Story = mongoose.model('Story', storySchema);