import mongoose from "mongoose";

const problemSchema = mongoose.Schema({
  problemNum: { type: Number },
  algoName: { type: String },
  level: { type: Number },
  link: { type: String },
  tags: { type: [String] },
});

const ProblemModel = mongoose.model("Problem", problemSchema);
export default ProblemModel;
