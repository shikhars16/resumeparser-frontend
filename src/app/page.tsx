// pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import UploadForm from '../app/components/UploadForm';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Head>
        <title>Resume Parser</title>
        <meta name="description" content="Upload and parse resumes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-6">
          Resume Parser
        </h1>
        <UploadForm />
      </main>
    </div>
  );
};

export default Home;
