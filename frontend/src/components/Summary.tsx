import React from "react";

interface Props {
  summary: string;
}

export const Summary: React.FC<Props> = ({ summary }) => (
  <section className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 mt-8">
    <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">
      Summary
    </h3>
    <p className="text-gray-700 leading-relaxed">{summary}</p>
  </section>
);
