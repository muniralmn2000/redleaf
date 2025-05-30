import React from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useLocation } from "wouter";

export default function MyMessagesPage() {
  const [userEmail, setUserEmail] = useState("");
  const [, navigate] = useLocation();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) navigate("/");
    setUserEmail(email || "");
  }, [navigate]);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/my-messages", userEmail],
    queryFn: () => apiRequest("GET", `/api/my-messages?email=${encodeURIComponent(userEmail)}`),
    enabled: !!userEmail,
  });

  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">My Messages</h1>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {safeMessages.length ? safeMessages.map((msg: any) => (
              <li key={msg.id} className="py-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{msg.subject}</span>
                  <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-gray-700 mt-1">{msg.message}</div>
                {msg.reply && (
                  <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <div className="text-xs text-blue-700 font-semibold mb-1">Admin Reply:</div>
                    <div className="text-blue-900">{msg.reply}</div>
                  </div>
                )}
              </li>
            )) : <li className="py-2 text-gray-500">No messages found.</li>}
          </ul>
        )}
      </div>
    </div>
  );
} 