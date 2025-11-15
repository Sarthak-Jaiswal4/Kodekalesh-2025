// chunk.model.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface for the Chunk schema
export interface IChunk{
  documentId: Types.ObjectId;
  caseId: Types.ObjectId;
  pageContent: string;
  metadata?: Record<string, any>;
  embedding: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ChunkSchema = new Schema<IChunk>(
  {
    // Link back to the parent document
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true
    },
    caseId: { // Denormalized for faster queries
      type: Schema.Types.ObjectId,
      ref: 'caseDetail',
      required: true,
      index: true
    },
    pageContent: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object, // Stores page number, etc.
    },
    embedding: {
      type: [Number],
      required: true,
    }
  },
  { timestamps: true }
);

export const chunkModel = mongoose.models.Chunk as mongoose.Model<IChunk> || mongoose.model<IChunk>('Chunk', ChunkSchema);