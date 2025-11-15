import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDocument {
    caseId: Types.ObjectId;
    title: string;
    docType: 'Motion' | 'Pleading' | 'Evidence' | 'Order' | 'Exhibit' | 'Notice' | 'Complaint';
    filedBy: string;
    dateFiled?: Date;
    storageUrl?: string;
    accessLevel?: 'Public' | 'Parties and Court' | 'Sealed (Judge Only)';
    createdAt?: Date;
    updatedAt?: Date;
}

const DocumentSchema = new Schema<IDocument>({
    caseId: { 
        type: Schema.Types.ObjectId, 
        ref: 'caseDetail',
        required: true,
        index: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    docType: {
        type: String,
        required: true,
        enum: [
            'Motion', 'Pleading', 'Evidence', 'Order', 'Exhibit', 'Notice', 'Complaint'
        ]
    },
    filedBy: { 
        type: String,
        required: true
    },
    dateFiled: {
        type: Date,
        default: Date.now
    },
    storageUrl: {
        type: String,
        // required: true
    },
    accessLevel: {
        type: String,
        enum: ['Public', 'Parties and Court', 'Sealed (Judge Only)'],
        default: 'Parties and Court'
    }
}, {
    timestamps: true
});

DocumentSchema.index({ caseId: 1, docType: 1 });
DocumentSchema.index({ keyLegalTopics: 1 });

export const documentModel = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);