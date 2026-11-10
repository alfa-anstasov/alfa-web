import { createStubPage } from '@/components/StubPage';

const stub = createStubPage('/faq');
export const generateMetadata = stub.generateMetadata;
export default stub.Page;
