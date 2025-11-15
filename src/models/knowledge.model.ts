import mongoose, { Document, Schema } from "mongoose";

// Judicial Content Types
export type JudicialSourceType = "Statute" | "CaseLaw" | "Regulation";
export type Jurisdiction = "Supreme Court" | "High Court of Delhi" | "Parliament of India";

// Interface for Judicial Content Document
export interface JudicialContentDocument extends Document {
  sourceType: JudicialSourceType; // Statute | CaseLaw | Regulation
  jurisdiction: Jurisdiction;
  title: string; // E.g. "Indian Penal Code" or "R v. R"
  citation: string; // Official legal citation, e.g. "1973 (4) SCC 225"
  fullText: string; // The full text
  vectorEmbedding: number[]; // For semantic search (RAG)
  keyPrinciples?: string[]; // AI-generated legal principles
  createdAt?: Date;
}

const JudicialContentSchema: Schema<JudicialContentDocument> = new Schema(
  {
    sourceType: {
      type: String,
      enum: ["Statute", "CaseLaw", "Regulation"],
      required: true,
      index: true
    },
    jurisdiction: {
      type: String,
      enum: [
        "Supreme Court",
        "High Court of Delhi",
        "Parliament of India"
      ],
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    citation: {
      type: String,
      required: true
    },
    fullText: {
      type: String,
      required: true
    },
    vectorEmbedding: {
      type: [Number],
      required: true,
      index: "2dsphere" // For vector search (MongoDB 7+ or via Atlas)
    },
    keyPrinciples: {
      type: [String],
      default: []
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const JudicialContentModel =
  (mongoose.models.JudicialContent as mongoose.Model<JudicialContentDocument>) ||
  mongoose.model<JudicialContentDocument>("JudicialContent", JudicialContentSchema);

export default JudicialContentModel;