"use client";
import React from "react";
import { useProfile } from "../../hooks/useProfile";
import Image from "next/image";


export default function UserMetaCard() {
  const { profile, loading, error, refetch } = useProfile();

   return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="flex items-center justify-center w-20 h-20 border border-gray-200 rounded-full dark:border-gray-800 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800">
              <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {profile?.name || "N/A"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile?.email || "N/A"}
                </p>                            
              </div>
            </div>            
          </div>
        </div>
      </div>
    </>
  );
}
