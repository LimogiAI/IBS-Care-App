import React from "react";

export const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <table className="w-full border-collapse border border-gray-300">{children}</table>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-200">
    {children}
  </thead>
);

export const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="border border-gray-300 px-4 py-2 text-left">{children}</th>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody>{children}</tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr className="border border-gray-300">{children}</tr>
);

export const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="border border-gray-300 px-4 py-2">{children}</td>
);
