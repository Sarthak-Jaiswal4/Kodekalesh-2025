import mongoose, { Document, Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

export type MessageRole = 'user' | 'ai';

export interface RetrievedContext {
  sourceType: string; // 'CaseDocument' | 'KnowledgeCorpus'
  sourceId: mongoose.Types.ObjectId;
  citation: string;
  snippet: string;
}

export interface MessageFeedback {
  rating?: 'Helpful' | 'Inaccurate';
  correction?: string;
}

export interface Message {
  role: MessageRole;
  content: string;
  timestamp?: Date;
  retrievedContext?: RetrievedContext[];
  feedback?: MessageFeedback;
}

export interface ChatDocument extends Document {
  userId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  caseTitle: string;
  messages: Message[];
}

// const RetrievedContextSchema = new Schema<RetrievedContext>(
//   {
//     sourceType: { type: String, required: true },
//     sourceId: { type: ObjectId, required: true },
//     citation: { type: String, required: true },
//     snippet: { type: String, required: true },
//   },
//   { _id: false }
// );

// const MessageFeedbackSchema = new Schema<MessageFeedback>(
//   {
//     rating: { type: String, enum: ['Helpful', 'Inaccurate'] },
//     correction: { type: String }
//   },
//   { _id: false }
// );

const MessageSchema = new Schema<Message>(
  {
    role: {
      type: String,
      enum: ['user', 'ai'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    // retrievedContext: {
    //   type: [RetrievedContextSchema],
    //   required: false,
    //   default: []
    // },
    // feedback: {
    //   type: MessageFeedbackSchema,
    //   required: false
    // }
  },
  { _id: false }
);

const ChatSchema = new Schema<ChatDocument>(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    caseId: { type: ObjectId, ref: "caseDetail", required: true },
    caseTitle: { type: String, required: true },
    messages: { type: [MessageSchema], required: true, default: [] }
  },
  {
    timestamps: true
  }
);

const ChatModel =
  (mongoose.models.Chat as mongoose.Model<ChatDocument>) ||
  mongoose.model<ChatDocument>("Chat", ChatSchema);

export default ChatModel;