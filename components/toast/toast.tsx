"use client";

import { useState } from "react";

type Toast = {
  message: string;
  type: "DANGER" | "SUCCESS" | "INFO" | "WARNING";
};

export default function ToastContainer({}) {
  const [list, setList] = useState<Toast[]>([]);

  return (
    <ul className="fixed bottom-4 right-16 flex flex-col gap-2 z-50">
      {list.map((toast) => {
        return <Toast toast={toast} />;
      })}
    </ul>
  );
}

function Toast({ toast }: { toast: Toast }) {
  return (
    <li className="bg-neutral-100 rounded-lg p-2 backdrop-blur-lg text-neutral-800">
      {toast.message}
    </li>
  );
}
