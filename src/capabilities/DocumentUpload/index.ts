// Document Upload: the one way to attach documents to an order - Additional Documents (a typed label, then the file), the signed-CAF upload,
// and the rules every upload shares (accepted types, size limit, refusal messages). The implementation lives with the domain components
// (components/domain/AdditionalDocumentsUpload.tsx, CafDocumentUpload.tsx, documentUploadRules.ts) so patterns can use it without reaching up
// into capabilities; this is the capability's public API for journeys and screens. Change an upload here (or its rules) and every journey has it.
export { AdditionalDocumentsUpload } from '../../components/domain/AdditionalDocumentsUpload';
export type { AdditionalDocument } from '../../components/domain/AdditionalDocumentsUpload';
export { CafDocumentUpload } from '../../components/domain/CafDocumentUpload';
export type { CafDocument } from '../../components/domain/CafDocumentUpload';
export { UPLOAD_RULES, uploadFileProblem } from '../../components/domain/documentUploadRules';
export type { UploadRules } from '../../components/domain/documentUploadRules';
export { SupportingDocumentField } from '../../components/domain/SupportingDocumentField';
