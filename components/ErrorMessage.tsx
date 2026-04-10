
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-700 border border-red-900 text-white px-4 py-3 rounded-md relative shadow-md flex items-center gap-2" role="alert">
      <span className="text-xl">⚠️</span>
      <div>
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline ml-2">{message}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;
