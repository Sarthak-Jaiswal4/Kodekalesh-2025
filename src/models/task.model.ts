import mongoose, { Document, Schema } from "mongoose";

export interface TaskSchema extends Document {
  caseId: mongoose.Types.ObjectId;            // Reference to the CaseSession
  judgeId: mongoose.Types.ObjectId;           // Reference to the User (judge)
  title: string;                             // E.g., "Rule on Motion to Dismiss"
  status: "Pending" | "In-Progress" | "Completed";
  priority: "High" | "Medium" | "Low";       // Set by AI or judge
  dueDate?: Date;                            // Optional
  triggerDocId?: mongoose.Types.ObjectId;    // Reference to Document that created this task
  notes?: string;                            // Judge's private notes
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema: Schema<TaskSchema> = new Schema(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "caseDetail",      // Link to CaseSession
      required: true
    },
    judgeId: { 
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "In-Progress", "Completed"],
      default: "Pending",
      required: true
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
      required: true
    },
    dueDate: {
      type: Date
    },
    triggerDocId: {
      type: Schema.Types.ObjectId,
      ref: "Document"
    },
    notes: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
);

TaskSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const TaskModel =
  (mongoose.models.Task as mongoose.Model<TaskSchema>) ||
  mongoose.model<TaskSchema>("Task", TaskSchema);

export default TaskModel;