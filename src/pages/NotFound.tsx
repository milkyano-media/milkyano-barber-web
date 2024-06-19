import Layout from '@/components/WebLayout';
import React from 'react';

const NotFound: React.FC = () => {
  return (
   <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-50">
              404 - Not Found
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              The page you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;