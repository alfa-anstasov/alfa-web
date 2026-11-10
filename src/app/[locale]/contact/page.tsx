import { createStubPage } from '@/components/StubPage';

const stub = createStubPage('/contact');
export const generateMetadata = stub.generateMetadata;
export default stub.Page;
