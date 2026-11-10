import { createStubPage } from '@/components/StubPage';

const stub = createStubPage('/offices');
export const generateMetadata = stub.generateMetadata;
export default stub.Page;
