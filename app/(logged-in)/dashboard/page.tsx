import BgGradient from "@/components/common/bg-gradient";
import SummaryCard from "@/components/summaries/summary-card";
import { Button } from "@/components/ui/button";
import { getSummaries } from "@/lib/summaries";
import { ArrowRight, Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";
import { redirect } from "next/navigation";
import EmptySummaryState from "@/components/summaries/empty-summary-state";

export default async function DashboardPage() {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    redirect("/sign-in");
  }

  const uploadLimit = 5;

  const summaries = await getSummaries(userId);
  return (
    <main className="min-h-screen">
      <BgGradient />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-2 py-12 sm:py-24">
          <div className="flex gap-4 mb-8 justify-between">
            <div className="flex flex-col gap-2">
              {/*in case use animating text use custom class animate-text-color for heading */}
              <h1
                className="text-5xl font-bold tracking-tight bg-linear-to-r
              from-gray-600 to-gray-900 bg-clip-text text-transparent"
              >
                Your Summaries
              </h1>
              <p className="text-gray-600">
                Transform your PDFs into concise, actionable insights.
              </p>
            </div>
            <Button
              variant={"link"}
              className="bg-linear-to-r from-rose-500 to-rose-700
            hover:from-rose-600 hover:to-rose-800  hover:scale-105 
            transition duration-300 group hover:no-underline"
            >
              <Link href="/upload" className="flex text-white items-center">
                <Plus className="w-5 h-5 mr-2" />
                New Summary
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800">
              <p className="text-sm inline">
                You've reached the limit of {uploadLimit} uploads on the Basic
                plan.
              </p>
              <Link
                href="/#pricing"
                className="text-rose-800 underline font-medium underline-offset-4 inline-flex items-center ml-2"
              >
                Click here to upgrade to Pro{" "}
                <ArrowRight className="w-4 h-4 inline-block mx-1" />
              </Link>
              for unlimited uploads.
            </div>
          </div>
          {summaries.length === 0 ? (
            <EmptySummaryState />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:px-0 md:grid-cols-2 lg:grid-cols-3">
              {summaries.map((summary) => (
                <SummaryCard key={summary.id} summary={summary} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
