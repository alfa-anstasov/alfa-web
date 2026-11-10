import { createStubPage } from '@/components/StubPage';

const stub = createStubPage('/funeral-products');
export const generateMetadata = stub.generateMetadata;
export default stub.Page;
