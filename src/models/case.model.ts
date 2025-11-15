import DBconnection from "@/lib/Connection";
import mongoose, { Document, Schema } from "mongoose";

export interface CaseDocument extends Document {
    judgeId?: mongoose.Types.ObjectId | null;
    caseNumber: string;
    caseTitle: string;
    caseType?: 'Civil' | 'Criminal' | 'Family' | 'Appellate' | 'Probate';
    status?: 'Active' | 'Pending' | 'Stayed' | 'Closed' | 'Appealed';
    dateFiled?: Date;
    documents?: Array<{
        docId?: mongoose.Types.ObjectId;
        title?: string;
        docType?: string;
        dateFiled?: Date;
        filedBy?: string;
    }>;
    customTags?: string[];
    aiCaseSummary?: string;
    aiConflictDetector?: Array<{
        source?: string;
        conflict?: string;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
}

await DBconnection()
const caseDetail: Schema<CaseDocument> = new Schema({
    judgeId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    caseNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    caseTitle: {
        type: String,
        required: true
    },
    caseType: {
        type: String,
        enum: ['Civil', 'Criminal', 'Family', 'Appellate', 'Probate']
    },
    status: {
        type: String,
        enum: ['Active', 'Pending', 'Stayed', 'Closed', 'Appealed'],
        default: 'Active'
    },
    dateFiled: {
        type: Date
    },
    documents: [{
        // docId: { type: Schema.Types.ObjectId, ref: 'Document' },
        title: String,
        docType: String,
        dateFiled: Date,
        filedBy: String
    }],
    customTags: [String],
    aiCaseSummary: {
        type: String // A living, 2-paragraph summary of the case status.
    },
    aiConflictDetector: [{
        source: String, // e.g., "Proposed Bill #2045" or "New Ruling in District 2"
        conflict: String // e.g., "Conflicts with Statute 12.4(a)"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

caseDetail.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const caseDetailModel = (mongoose.models.caseDetail as mongoose.Model<CaseDocument>) || (mongoose.model<CaseDocument>("caseDetail", caseDetail));
export default caseDetailModel